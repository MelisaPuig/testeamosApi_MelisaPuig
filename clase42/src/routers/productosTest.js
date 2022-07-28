const express = require("express");

const APIProductos = require("../controlador/productos");
const apiProductos = new APIProductos();
const routerProductosTest = express.Router();

routerProductosTest.get("/", apiProductos.getFakeProducts);

routerProductosTest.all("*", (req, res, next) => {
  const notFoundMethodError = new Error(`${req.url} no es una API válida.`);
  next(notFoundMethodError);
});

routerProductosTest.use((error, req, res, next) => {
  console.error(error);
  res.send({ error: error.message });
});

module.exports = routerProductosTest;
