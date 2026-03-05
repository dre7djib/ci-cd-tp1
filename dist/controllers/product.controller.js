"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.create = exports.getById = exports.list = void 0;
const service_product_1 = require("../services/service.product");
const list = (_req, res) => {
    res.json((0, service_product_1.getAllProducts)());
};
exports.list = list;
const getById = (req, res) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
        res.status(400).json({ error: "Invalid product id" });
        return;
    }
    const product = (0, service_product_1.getProduct)(id);
    if (!product) {
        res.status(404).json({ error: "Product not found" });
        return;
    }
    res.json(product);
};
exports.getById = getById;
const create = (req, res) => {
    const { name, price } = req.body || {};
    if (typeof name !== "string" || typeof price !== "number") {
        res.status(400).json({ error: "Invalid payload" });
        return;
    }
    res.status(201).json((0, service_product_1.createProduct)(name, price));
};
exports.create = create;
const update = (req, res) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
        res.status(400).json({ error: "Invalid product id" });
        return;
    }
    const { name, price } = req.body || {};
    if ((name !== undefined && typeof name !== "string") ||
        (price !== undefined && typeof price !== "number")) {
        res.status(400).json({ error: "Invalid payload" });
        return;
    }
    const product = (0, service_product_1.updateProduct)(id, name, price);
    if (!product) {
        res.status(404).json({ error: "Product not found" });
        return;
    }
    res.json(product);
};
exports.update = update;
const remove = (req, res) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
        res.status(400).json({ error: "Invalid product id" });
        return;
    }
    if (!(0, service_product_1.deleteProduct)(id)) {
        res.status(404).json({ error: "Product not found" });
        return;
    }
    res.status(204).send();
};
exports.remove = remove;
