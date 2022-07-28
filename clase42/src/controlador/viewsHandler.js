const SocketServer = require("socket.io");

const Contenedor = require("../servicio/Contenedor");
const contenedor = new Contenedor();

class ViewsHandler {
  async renderDatos(req, res, next) {
    const productos = await contenedor.getAll();
    const hayProductos = productos.length > 0;
    res.render("datos", { productos, hayProductos });
  }

  renderAddProducto(socketIO) {
    return async (req, res, next) => {
      try {
        const { title, price, thumbnail } = req.body;
        if (
          typeof title !== "undefined" &&
          typeof price !== "undefined" &&
          typeof thumbnail !== "undefined"
        ) {
          await contenedor.save(title, price, thumbnail);
        }
        const products = await contenedor.getAll();
        socketIO.sockets.emit("products", products);
        res.redirect("/productos");
      } catch (error) {
        next(error);
      }
    };
  }

  async renderFormulario(req, res, next) {
    const { username } = req.user;
    res.render("formulario", { username });
  }
}

module.exports = new ViewsHandler();
