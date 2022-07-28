class UserDTO {
  constructor(data) {
    this.id = data.id || data._id;
    this.username = this._getPropFromDataOrError(data, "username");
  }

  _getPropFromDataOrError(data, prop) {
    if (typeof data[prop] === "undefined") {
      throw new Error(`No se encontró la propiedad ${prop}.`);
    }
    return data[prop];
  }
}

module.exports = UserDTO;
