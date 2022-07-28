const fs = require("fs");
const path = require("path");

const productsFaker = require("./productsFaker");
const DAOFactory = require("../../persistencia/dao/ProductosDAOFactory");

const BASE_FILE_PATH = path.join(__dirname, "productos.txt");

class Contenedor {
  constructor() {
    this.filePath = BASE_FILE_PATH;
  }

  getFakeProducts(count) {
    return productsFaker.generateProducts(count);
  }

  async exists(id) {
    try {
      const dao = await DAOFactory.getInstanciaDAO();
      return dao.exists(id);
    } catch (error) {
      throw error;
    }
  }

  async save(title, price, thumbnail) {
    try {
      const dao = await DAOFactory.getInstanciaDAO();
      return dao.save({
        nombre: title,
        precio: price,
        foto: thumbnail,
        descripcion: title,
        stock: 0,
      });
    } catch (error) {
      throw new Error(
        `Ha ocurrido un error agregando el contenido: ${error.description}`
      );
    }
  }

  async getById(id) {
    try {
      const dao = await DAOFactory.getInstanciaDAO();
      return dao.getById(id);
    } catch (error) {
      throw error;
    }
  }

  async getAll() {
    try {
      const dao = await DAOFactory.getInstanciaDAO();
      return dao.getAll();
    } catch (error) {
      throw error;
    }
  }

  async update(id, title, price, thumbnail) {
    try {
      const dao = await DAOFactory.getInstanciaDAO();
      return dao.update(id, {
        nombre: title,
        precio: price,
        descripcion: "",
        foto: thumbnail,
      });
    } catch (error) {
      throw error;
    }
  }

  async deleteById(id) {
    try {
      const dao = await DAOFactory.getInstanciaDAO();
      return dao.deleteById(id);
    } catch (error) {
      throw error;
    }
  }

  async deleteAll() {
    try {
      const dao = await DAOFactory.getInstanciaDAO();
      return dao.deleteAll();
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Contenedor;
