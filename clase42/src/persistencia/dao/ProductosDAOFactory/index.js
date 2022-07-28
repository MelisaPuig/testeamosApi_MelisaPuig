const config = require("../../../config");
const DATABASES = require("../../../constants/databases");
const ProductosDAOArchivo = require("./ProductosDAOArchivo");
const ProductosDAOMemoria = require("./ProductosDAOMemoria");
const ProductosDAOMongo = require("./ProductosDAOMongo");
const ProductosDAOFirebase = require("./ProductoDAOFirebase");

class ProductosDAOFactory {
  // PATRON SINGLETON
  async getInstanciaDAO() {
    try {
      if (typeof this.DAO === "undefined") {
        this.DAO = this._getDAO();
        await this.DAO.connect();
      }
      return this.DAO;
    } catch (error) {
      throw error;
    }
  }

  _getDAO() {
    switch (config.DATABASE_TYPE) {
      case DATABASES.MEMORIA:
        return new ProductosDAOMemoria();
      case DATABASES.MEMORIA:
        return new ProductosDAOArchivo();
      case DATABASES.MONGO:
        return new ProductosDAOMongo();
      case DATABASES.FIREBASE:
        return new ProductosDAOFirebase();
      default:
        throw new Error(
          `No se reconocó el tipo de base de datos: ${config.DATABASE_TYPE}.`
        );
    }
  }
}

/**
 * Exporto el objeto y no la clase para que funcione el Singleton.
 */
module.exports = new ProductosDAOFactory();
