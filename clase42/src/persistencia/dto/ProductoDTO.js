class ProductoDTO {
  constructor(data) {
    this.id = data._id || data.id;
    this.nombre = this._getPropFromDataOrError(data, "nombre");
    this.descripcion = this._getPropFromDataOrError(data, "descripcion");
    this.foto = this._getPropFromDataOrError(data, "foto");
    this.precio = this._getPropFromDataOrError(data, "precio");
    this.stock = data.stock || 0;
    this.timestamp = data.timestamp;
    this.codigo = data.codigo;
  }

  _getPropFromDataOrError(data, prop) {
    if (typeof data[prop] === "undefined") {
      throw new Error(`No se encontró la propiedad ${prop}.`);
    }
    return data[prop];
  }
}

module.exports = ProductoDTO;
