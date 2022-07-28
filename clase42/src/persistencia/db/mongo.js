const mongoose = require("mongoose");

const CONFIG = require("../../config");

class Mongo {
  async connect(mongoURL) {
    try {
      if (mongoose.STATES[mongoose.connection.readyState] === "connected") {
        return mongoose.connection.db;
      }
      const mongooseConfig = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        autoIndex: true,
        autoCreate: true,
      };
      console.log(CONFIG.MONGO_URL);
      await mongoose.connect(CONFIG.MONGO_URL, mongooseConfig);
      if (mongoose.STATES[mongoose.connection.readyState] !== "connected") {
        throw new Error("MongoDB isn't connected.");
      }
      return mongoose.connection.db;
    } catch (error) {
      throw error;
    }
  }

  async disconnect() {
    return mongoose.connection.close();
  }
}

module.exports = new Mongo();
