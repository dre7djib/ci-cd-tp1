type Product = {
  id: number;
  name: string;
  price: number;
};

let products: Product[] = [];
let nextId = 1;

export const createProduct = (name: string, price: number): Product => {
  const product: Product = { id: nextId++, name, price };
  products.push(product);
  return product;
};

export const getProduct = (id: number): Product | undefined => {
  return products.find(p => p.id === id);
};

export const getAllProducts = (): Product[] => {
  return products;
};

export const updateProduct = (id: number, name?: string, price?: number): Product | undefined => {
  const product = products.find(p => p.id === id);
  if (!product) {
    return undefined;
  }
  if (name !== undefined) {
    product.name = name;
  }
  if (price !== undefined) {
    product.price = price;
  }
  return product;
};

export const deleteProduct = (id: number): boolean => {
  const index = products.findIndex(p => p.id === id);
  if (index >= 0) {
    products.splice(index, 1);
    return true;
  }
  return false;
};