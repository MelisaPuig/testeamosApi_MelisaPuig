const HTTPClient = require("./client");

const client = new HTTPClient();

const newProduct = () => {
  const randomTitle = Math.floor(Math.random() * 1000000);
  return {
    title: `Producto test ${randomTitle}`,
    price: Math.random() * 1000,
    thumbnail:
      "https://media.istockphoto.com/photos/mystery-box-isolated-picture-id1138540348?k=20&m=1138540348&s=170667a&w=0&h=XOFnhE22cqf05AUbe4msKYA0aNcI-p7dXmFtGHXItjM=",
  };
};

const test = async () => {
  try {
    // TESTEAR GET ALL.
    console.log("Obteniendo todos los productos:");
    const allProducts = await client.getAllProducts();
    console.table(allProducts);

    // TESTEAR GET BY ID.
    if (allProducts.length > 0) {
      const firstId = allProducts[0].id;
      console.log(`\nObteniendo producto con id ${firstId}`);
      const productById = await client.getProductById(firstId);
      console.table([productById]);
    } else {
      console.log(`\nNo hay productos. No se puede obtener por ID`);
    }

    // TESTEAR AGREGAR:
    console.log("Producto agregado:");
    const { title, price, thumbnail } = newProduct();
    const addedProduct = await client.addProduct(title, price, thumbnail);
    console.table([addedProduct]);

    // TESTEAR MODIFICACIÓN.
    const updatedId = addedProduct.id;
    const newName = "Nombre modificado";
    const updatedProduct = await client.updateProduct(updatedId, {
      title: newName,
      price: addedProduct.precio,
      thumbnail: addedProduct.foto,
    });
    console.log("\nProducto modificado:");
    console.table([updatedProduct]);

    // TESTEAR ELIMINAR.
    console.log("Eliminar producto");
    await client.deleteById(addedProduct.id);
    const allProductsAfterDeletion = await client.getAllProducts();
    const allProductIds = allProductsAfterDeletion.map((e) => e.id);
    const deletedExists = allProductIds.includes(addedProduct.id);
    if (deletedExists) {
      console.log(`\nNo se pudo eliminar el producto ${addedProduct.id}`);
    } else {
      console.log(
        `\nEl producto ${addedProduct.id} fue eliminado correctamente.`
      );
    }

    // const toDeleteIds = allProductIds.slice(3, 21);
    // await Promise.all(toDeleteIds.map((e) => client.deleteById(e)));
  } catch (error) {
    throw error;
  }
};

test();
