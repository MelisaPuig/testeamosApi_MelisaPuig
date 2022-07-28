require("dotenv").config();
const PORT = process.env.PORT || 8080;

const request = require("supertest")(`http://localhost:${PORT}/api/productos`);
const expect = require("chai").expect;

const getNewProduct = () => {
  const random = Math.floor(Math.random() * 100000);
  return {
    title: `Test ${random}`,
    price: 10,
    thumbnail:
      "https://media.istockphoto.com/photos/mystery-box-isolated-picture-id1138540348?k=20&m=1138540348&s=170667a&w=0&h=XOFnhE22cqf05AUbe4msKYA0aNcI-p7dXmFtGHXItjM=",
  };
};

const expectProductKeys = (product) => {
  const expectedKeys = ["nombre", "precio", "stock", "foto"];
  expect(product).to.include.keys(expectedKeys);
};

describe("API REST de productos ", () => {
  let addedProductId = -1;

  it("debe devolver productos.", async () => {
    const getAllProductsRequest = await request.get("/");
    expect(getAllProductsRequest.statusCode).eql(200);
    expect(getAllProductsRequest.body.result.length).greaterThan(0);
  });

  it("debe devolver un producto específico según su ID.", async () => {
    const getAllProductsRequest = await request.get("/");
    const firstProduct = getAllProductsRequest.body.result[0];
    const firstProductId = firstProduct.id;
    const getProductByIdRequest = await request.get(`/${firstProductId}`);
    expect(getProductByIdRequest.statusCode).eql(200);
    expect(getProductByIdRequest.body.result.id).eql(firstProductId);
    expectProductKeys(getProductByIdRequest.body.result);
  });

  it("debe agregar producto específicado.", async () => {
    const newProduct = getNewProduct();
    const { title, price, thumbnail } = newProduct;
    const addProductRequest = await request.post("/").send(newProduct);
    expect(addProductRequest.statusCode).eql(200);
    const result = addProductRequest.body.result;
    expectProductKeys(result);
    expect(result.nombre).eql(title);
    expect(result.precio).eql(price);
    expect(result.foto).eql(thumbnail);
    addedProductId = result.id;
  });

  it("debe modificar el producto especificado.", async () => {
    if (addedProductId === -1) {
      throw new Error(`No se ha creado el producto esperado.`);
    }
    const productData = getNewProduct();
    productData.title = "NEW title";
    const updateProductRequest = await request
      .put(`/${addedProductId}`)
      .send(productData);
    const { title, price, thumbnail } = productData;
    expect(updateProductRequest.statusCode).eql(200);
    const result = updateProductRequest.body.result;
    expectProductKeys(result);
    expect(result.nombre).eql(title);
    expect(result.precio).eql(price);
    expect(result.foto).eql(thumbnail);
  });

  it("debe eliminar el producto especificado.", async () => {
    if (addedProductId === -1) {
      throw new Error(`No se ha creado el producto esperado.`);
    }
    const deleteRequest = await request.delete(`/${addedProductId}`);
    expect(deleteRequest.statusCode).eql(200);
  });
});
