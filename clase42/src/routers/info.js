const express = require("express");

const apiInfo = require("../controlador/info");
const routerInfo = express.Router();

routerInfo.use(express.json());

routerInfo.get("/", apiInfo.getInfo);

routerInfo.all("*", (req, res, next) => {
  const notFoundMethodError = new Error(`${req.url} no es una API válida.`);
  next(notFoundMethodError);
});

routerInfo.use((error, req, res, next) => {
  console.error(error);
  res.send({ error: error.message });
});

module.exports = routerInfo;
