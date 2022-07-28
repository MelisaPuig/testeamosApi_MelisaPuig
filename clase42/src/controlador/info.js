const processValues = require("../servicio/processValues");

class APIInfo {
  constructor() {}

  async getInfo(req, res, next) {
    try {
      const info = processValues.get();
      res.render("info", { info });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new APIInfo();
