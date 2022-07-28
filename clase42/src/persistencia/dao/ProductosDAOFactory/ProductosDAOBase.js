const CustomError = require("../../../errors/CustomError");

const PRODUCT_REQUIRED_PROPERTIES = ["nombre", "descripcion", "foto", "precio"];

class ProductosDAOBase {
  async connect() {
    throw new CustomError(500, "Método no establecido.");
  }

  async exists(id) {
    throw new CustomError(500, "Método no establecido.");
  }

  async save(newProduct) {
    throw new CustomError(500, "Método no establecido.");
  }

  async getById(id) {
    throw new CustomError(500, "Método no establecido.");
  }

  async getAll() {
    throw new CustomError(500, "Método no establecido.");
  }

  async update(id, productData) {
    throw new CustomError(500, "Método no establecido.");
  }

  async deleteById(id) {
    throw new CustomError(500, "Método no establecido.");
  }

  async deleteAll() {
    throw new CustomError(500, "Método no establecido.");
  }

  async disconnect() {
    throw new CustomError(500, "Método no establecido.");
  }

  _throwErrorIfInvalidProduct(product) {
    PRODUCT_REQUIRED_PROPERTIES.forEach((requiredProperty) => {
      if (typeof product[requiredProperty] === "undefined") {
        throw new Error(
          `El producto debe tener la propiedad ${requiredProperty}.`
        );
      }
    });
  }
}

module.exports = ProductosDAOBase;
