const axios = require("axios");
require("dotenv").config();

const PORT = process.env.port || 8080;
const BASE_URL = `http://localhost:${PORT}/api/productos`;

console.log(BASE_URL);
const axiosClient = axios.create({
  baseURL: BASE_URL,
});

class ClienteHTTP {
  async getAllProducts() {
    try {
      const result = await axiosClient.get("/");
      return result.data.result;
    } catch (error) {
      throw error;
    }
  }

  async getProductById(id) {
    try {
      const result = await axiosClient.get(`/${id}`);
      return result.data.result;
    } catch (error) {
      throw error;
    }
  }

  async addProduct(title, price, thumbnail) {
    try {
      const data = { title, price, thumbnail };
      const result = await axiosClient.post(`/`, data);
      return result.data.result;
    } catch (error) {
      throw error;
    }
  }

  async updateProduct(id, updates) {
    try {
      const result = await axiosClient.put(`/${id}`, updates);
      return result.data.result;
    } catch (error) {
      throw error;
    }
  }

  async deleteById(id) {
    try {
      const result = await axiosClient.delete(`/${id}`);
      return result.data;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ClienteHTTP;
