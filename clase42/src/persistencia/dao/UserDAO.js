const bcrypt = require("bcrypt");
const userORM = require("../orm/user");
const UserDTO = require("../dto/UserDTO");

class UserDAO {
  async register(username, rawPassword) {
    try {
      if (username === "" || rawPassword === "") {
        throw new Error("Debería haber algún usuario o contraseña.");
      }
      const password = this._hashPassword(rawPassword);
      const newUser = { username, password };
      const createdUser = await userORM.create(newUser);
      delete createdUser.password;
      return new UserDTO(createdUser.toObject());
    } catch (error) {
      console.error(error);
      throw new Error("ERROR USER SIGNUP");
    }
  }

  async findById(id) {
    try {
      const dbUser = await userORM.findOne({ _id: id });
      if (!dbUser) {
        throw new Error(`No existe el usuario ${id}`);
      }
      const user = dbUser.toObject();
      return new UserDTO(user);
    } catch (error) {
      console.error(error);
      throw new Error("ERROR USER LOGIN");
    }
  }

  async login(username, rawPassword) {
    try {
      const dbUser = await userORM.findOne({ username });
      if (!dbUser) {
        throw new Error(`No existe el usuario ${username}`);
      }
      const existingUser = dbUser.toObject();
      const { password } = existingUser;
      const paswordsOk = bcrypt.compareSync(rawPassword, password);
      if (!paswordsOk) {
        throw new Error(`Las contraseñas de ${username} no coinciden.`);
      }
      return new UserDTO(existingUser);
    } catch (error) {
      console.error(error);
      throw new Error("ERROR USER LOGIN");
    }
  }

  _hashPassword(rawPassword) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(rawPassword, salt);
  }
}

module.exports = new UserDAO();
