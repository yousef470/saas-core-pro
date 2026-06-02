import mockProducts from "../data/mockProducts";

const STORAGE_KEY = "products";

export const getProducts = () => {
  const data = localStorage.getItem(STORAGE_KEY);

  if (data) return JSON.parse(data);

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(mockProducts)
  );

  return mockProducts;
};

export const addProduct = (product) => {
  const products = getProducts();

  const updated = [...products, product];

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updated)
  );

  return updated;
};

export const updateProduct = (updatedProduct) => {
  const products = getProducts();

  const updated = products.map((p) =>
    p.id === updatedProduct.id
      ? updatedProduct
      : p
  );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updated)
  );

  return updated;
};

export const deleteProduct = (id) => {
  const products = getProducts();

  const updated = products.filter(
    (p) => p.id !== id
  );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updated)
  );

  return updated;
};