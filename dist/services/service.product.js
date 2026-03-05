"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.getAllProducts = exports.getProduct = exports.createProduct = void 0;
let products = [];
let nextId = 1;
const createProduct = (name, price) => {
    const product = { id: nextId++, name, price };
    products.push(product);
    return product;
};
exports.createProduct = createProduct;
const getProduct = (id) => {
    return products.find(p => p.id === id);
};
exports.getProduct = getProduct;
const getAllProducts = () => {
    return products;
};
exports.getAllProducts = getAllProducts;
const updateProduct = (id, name, price) => {
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
exports.updateProduct = updateProduct;
const deleteProduct = (id) => {
    const index = products.findIndex(p => p.id === id);
    if (index >= 0) {
        products.splice(index, 1);
        return true;
    }
    return false;
};
exports.deleteProduct = deleteProduct;
