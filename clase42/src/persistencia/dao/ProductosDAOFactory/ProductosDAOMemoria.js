const ProductosDAOBase = require("./ProductosDAOBase");
const ProductoDTO = require("../../dto/ProductoDTO");

class ProductosDAOMemoria extends ProductosDAOBase {
  constructor() {
    super();
    this.contenedor = [];
  }

  async connect() {
    // Nada.
  }

  async exists(id) {
    const searchedProduct = this.contenedor.find((e) => e.id === id);
    return typeof searchedProduct !== "undefined";
  }

  async save(newProduct) {
    this._throwErrorIfInvalidProduct(newProduct);
    newProduct.timestamp = new Date();
    newProduct.codigo = Math.random().toString(36);
    let newProductId = 1;
    const entries = this.contenedor;
    if (entries.length > 0) {
      const entryIds = this.contenedor.map((e) => e.id);
      const maxId = Math.max(...entryIds);
      newProductId = maxId + 1;
    }
    newProduct.id = newProductId;
    this.contenedor.push(newProduct);
    return new ProductoDTO(newProduct);
  }

  async getById(id) {
    const searchedProduct = this.contenedor.find((e) => e.id === id);
    if (typeof searchedProduct === "undefined") {
      return null;
    }
    return new ProductoDTO(searchedProduct);
  }

  async getAll() {
    return this.contenedor.map((e) => new ProductoDTO(e));
  }

  async update(id, productData) {
    this._throwErrorIfInvalidProduct(productData);
    const { nombre, descripcion, foto, precio, stock } = productData;
    const searchedIndex = this.contenedor.findIndex((e) => e.id === id);
    if (searchedIndex === -1) {
      throw new Error(`No existe la entrada con el Id: ${id}`);
    }
    this.contenedor[searchedIndex].nombre = nombre;
    this.contenedor[searchedIndex].descripcion = descripcion;
    this.contenedor[searchedIndex].foto = foto;
    this.contenedor[searchedIndex].precio = precio;
    this.contenedor[searchedIndex].stock = stock;
    return new ProductoDTO(this.contenedor[searchedIndex]);
  }

  async deleteById(id) {
    this.contenedor = this.contenedor.filter((e) => e.id !== id);
  }

  async deleteAll() {
    this.contenedor = [];
  }

  async disconnect() {
    // Nada.
  }
}

module.exports = ProductosDAOMemoria;
