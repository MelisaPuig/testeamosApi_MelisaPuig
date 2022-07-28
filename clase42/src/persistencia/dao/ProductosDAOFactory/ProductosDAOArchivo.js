const fs = require("fs");
const path = require("path");

const ProductosDAOBase = require("./ProductosDAOBase");
const ProductoDTO = require("../../dto/ProductoDTO");

const BASE_FILE_PATH = path.join(__dirname, "productos.txt");

class ContenedorArchivo extends ProductosDAOBase {
  constructor() {
    super();
    this.filePath = BASE_FILE_PATH;
  }

  async connect() {
    // Nada.
  }

  async exists(id) {
    try {
      const entries = await this._getEntriesFromFile();
      const searchedProduct = entries.find((e) => e.id === id);
      return typeof searchedProduct !== "undefined";
    } catch (error) {
      throw error;
    }
  }

  async save(newProduct) {
    try {
      this._throwErrorIfInvalidProduct(newProduct);
      newProduct.timestamp = new Date();
      newProduct.codigo = Math.random().toString(36);

      const entries = await this._getEntriesFromFile();
      let newProductId = 1;
      if (entries.length > 0) {
        const entryIds = entries.map((e) => e.id);
        const maxId = Math.max(...entryIds);
        newProductId = maxId + 1;
      }
      newProduct.id = newProductId;
      entries.push(newProduct);
      await this._saveEntriesToFile(entries);
      return new ProductoDTO(newProduct);
    } catch (error) {
      throw new Error(`Ha ocurrido un error agregando el contenido: ${error}`);
    }
  }

  async getById(id) {
    try {
      const entries = await this._getEntriesFromFile();
      const searchedProduct = entries.find((e) => e.id === id);
      if (typeof searchedProduct === "undefined") {
        return null;
      }
      return new ProductoDTO(searchedProduct);
    } catch (error) {
      throw error;
    }
  }

  async getAll() {
    try {
      const entries = await this._getEntriesFromFile();
      return entries.map((e) => new ProductoDTO(e));
    } catch (error) {
      throw error;
    }
  }

  async update(id, productData) {
    try {
      this._throwErrorIfInvalidProduct(productData);
      const { nombre, descripcion, foto, precio, stock } = productData;
      const entries = await this._getEntriesFromFile();
      const searchedIndex = entries.findIndex((e) => e.id === id);
      if (searchedIndex === -1) {
        throw new Error(`No existe la entrada con el Id: ${id}`);
      }
      entries[searchedIndex].nombre = nombre;
      entries[searchedIndex].descripcion = descripcion;
      entries[searchedIndex].foto = foto;
      entries[searchedIndex].precio = precio;
      entries[searchedIndex].stock = stock;
      await this._saveEntriesToFile(entries);
      return new ProductoDTO(entries[searchedIndex]);
    } catch (error) {
      throw error;
    }
  }

  async deleteById(id) {
    try {
      const entries = await this._getEntriesFromFile();
      const filteredEntries = entries.filter((e) => e.id !== id);
      await this._saveEntriesToFile(filteredEntries);
    } catch (error) {
      throw error;
    }
  }

  async deleteAll() {
    try {
      await this._saveEntriesToFile([]);
    } catch (error) {
      throw error;
    }
  }

  async disconnect() {
    // Nada.
  }

  /**
   * PRIVATE METHODS.
   */
  async _getEntriesFromFile() {
    try {
      const fileExists = fs.existsSync(this.filePath);
      if (!fileExists) {
        return [];
      }
      const fileContent = await fs.promises.readFile(this.filePath, "utf8");
      const entries = JSON.parse(fileContent);
      return entries;
    } catch (error) {
      throw error;
    }
  }

  async _saveEntriesToFile(entries) {
    try {
      const JSONEntries = JSON.stringify(entries);
      const fileExists = fs.existsSync(this.filePath);
      if (fileExists) {
        await fs.promises.unlink(this.filePath);
      }
      await fs.promises.writeFile(this.filePath, JSONEntries, "utf-8");
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ContenedorArchivo;
