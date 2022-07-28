const mongo = require("../../../db/mongo");

const ProductosDAOBase = require("../ProductosDAOBase");
const ProductoDTO = require("../../../dto/ProductoDTO");
const mongoModel = require("./odm");

class ProductosDAOMongo extends ProductosDAOBase {
  async connect() {
    return mongo.connect();
  }

  async exists(id) {
    try {
      const searched = await this.getById(id);
      return searched !== null;
    } catch (error) {
      throw error;
    }
  }

  async save(newProduct) {
    try {
      this._throwErrorIfInvalidProduct(newProduct);
      newProduct.timestamp = new Date();
      newProduct.codigo = Math.random().toString(36);
      let productId = 0;
      const products = await this.getAll();
      if (products.length > 0) {
        const ids = products.map((e) => e.id);
        productId = Math.max(...ids);
        if (Number.isNaN(productId)) {
          productId = 1;
        }
      }
      newProduct.id = productId + 1;
      const mongoNewProduct = new mongoModel(newProduct);
      const result = await mongoNewProduct.save();
      return new ProductoDTO(result);
    } catch (error) {
      throw new Error(`Ha ocurrido un error agregando el contenido: ${error}`);
    }
  }

  async getById(id) {
    try {
      const searchedFound = await mongoModel.findOne({ _id: id }).lean();
      if (!searchedFound) {
        return null;
      }
      return new ProductoDTO(searchedFound);
    } catch (error) {
      throw error;
    }
  }

  async getAll() {
    try {
      const results = await mongoModel.find().lean();
      return results.map((e) => new ProductoDTO(e));
    } catch (error) {
      throw error;
    }
  }

  async update(id, productData) {
    try {
      this._throwErrorIfInvalidProduct(productData);
      const existingEntry = await this.exists(id);
      if (!existingEntry) {
        throw new Error(`No existe la entrada con el Id: ${id}`);
      }
      await mongoModel.updateOne({ _id: id }, { $set: productData });
      return this.getById(id);
    } catch (error) {
      throw error;
    }
  }

  async deleteById(id) {
    try {
      await mongoModel.findOneAndDelete({ _id: id });
    } catch (error) {
      throw error;
    }
  }

  async deleteAll() {
    try {
      await mongoModel.deleteMany({});
    } catch (error) {
      throw error;
    }
  }

  async disconnect() {
    return mongo.disconnect();
  }
}

module.exports = ProductosDAOMongo;
