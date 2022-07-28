const cluster = require("cluster");
const express = require("express");
const handlebars = require("express-handlebars");
const http = require("http");
const os = require("os");
const path = require("path");
const SocketServer = require("socket.io");

const CONFIG = require("./config");
const Contenedor = require("./servicio/Contenedor");
const Chat = require("./servicio/Chat");
const mongo = require("./persistencia/db/mongo");
const routerProductos = require("./routers/productos");
const routerProductosTest = require("./routers/productosTest");
const routerRandoms = require("./routers/randoms");
const routerInfo = require("./routers/info");
const viewsHandler = require("./controlador/viewsHandler");
const routerSessions = require("./routers/session");

const app = express();
const server = http.Server(app);
const socketIO = SocketServer(server);

const TEMPLATER_ENGINE = "hbs";
const PUBLIC_PATH = path.join(__dirname, "public");
const VIEWS_PATH = path.join(__dirname, "./views", TEMPLATER_ENGINE);
const LAYOUTS_PATH = path.join(VIEWS_PATH, "layouts");
const PARTIALS_PATH = path.join(VIEWS_PATH, "layouts");

const contenedor = new Contenedor();
const chat = new Chat();

/**
 * CONFIGURACIÓN DE VISTAS (handlebars).
 */
app.set(`views`, VIEWS_PATH);
app.set(`view engine`, TEMPLATER_ENGINE);
if (TEMPLATER_ENGINE === "hbs") {
  app.engine(
    `hbs`,
    handlebars.engine({
      extname: ".hbs",
      layoutsDir: LAYOUTS_PATH,
      partialsDir: PARTIALS_PATH,
    })
  );
}

/**
 * RUTEOS.
 */
app.use("/public", express.static(PUBLIC_PATH));
app.use("/info", routerInfo);
app.use("/api/randoms", routerRandoms);
app.use("/api/productos", routerProductos);
app.use("/api/productos-test", routerProductosTest);
// SE MOVIO EL MANEJO DEL A SESIÓN AL FINAL, PORQUE IS NO, NO SE PUEDE UTILIZAR LA API EN EL CLIENTE HTTP.
app.use(routerSessions);

/**
 * VISTAS
 * Necesito ponerlo acá para poder pasar socket.io
 */
app.get("/productos", viewsHandler.renderDatos);
app.post("/productos", viewsHandler.renderAddProducto(socketIO));
app.get("*", viewsHandler.renderFormulario);

/**
 * CONTROL DE SOCKET.IO.
 */
socketIO.on("connection", async (socket) => {
  const productos = await contenedor.getAll();
  socket.emit("products", productos);

  const chats = await chat.getAllNormalized();
  socket.emit("chats", chats);

  socket.on("chats", async (data) => {
    const { author, text } = data;
    await chat.addMessage(author, text);
    const chats = await chat.getAllNormalized();
    socket.emit("chats", chats);
  });
});
socketIO.on("error", (error) => console.log(error));

/**
 * INICIO DE SERVIDOR.
 */
async function startServerClustered() {
  if (cluster.isMaster) {
    const numWorkers = os.cpus().length;
    for (let i = 0; i < numWorkers; i++) {
      cluster.fork({ silent: true });
    }
    cluster.on("online", (worker) =>
      console.log(`Worker ${worker.process.pid} iniciado.`)
    );
    cluster.on("exit", (worker, code, signal) => {
      const { pid } = worker.process;
      console.log(`Worker ${pid} terminó con código ${code}.`);
    });
    return;
  }
  startServerForked();
}

async function startServerForked() {
  try {
    await mongo.connect(CONFIG.MONGO_URL);
    const { pid } = process;
    const listeningServer = server.listen(CONFIG.PORT, () => {
      console.log(
        `Servidor proceso ${pid} escuchando en el puerto ${CONFIG.PORT}`
      );
    });
    listeningServer.on(`error`, (error) =>
      console.log(`Este es el error ${error}`)
    );
  } catch (error) {
    throw error;
  }
}

if (CONFIG.IS_CLUSTER) {
  startServerClustered();
} else {
  startServerForked();
}
