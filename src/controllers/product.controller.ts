import { Request, Response } from "express";
import {
  createProduct,
  getProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
} from "../services/service.product";

export const list = (_req: Request, res: Response): void => {
  res.json(getAllProducts());
};

export const getById = (req: Request, res: Response): void => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    res.status(400).json({ error: "Invalid product id" });
    return;
  }
  const product = getProduct(id);
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.json(product);
};

export const create = (req: Request, res: Response): void => {
  const { name, price } = (req.body as { name?: unknown; price?: unknown }) || {};
  if (typeof name !== "string" || typeof price !== "number") {
    res.status(400).json({ error: "Invalid payload" });
    return;
  }
  res.status(201).json(createProduct(name, price));
};

export const update = (req: Request, res: Response): void => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    res.status(400).json({ error: "Invalid product id" });
    return;
  }
  const { name, price } = (req.body as { name?: unknown; price?: unknown }) || {};
  if (
    (name !== undefined && typeof name !== "string") ||
    (price !== undefined && typeof price !== "number")
  ) {
    res.status(400).json({ error: "Invalid payload" });
    return;
  }
  const product = updateProduct(
    id,
    name as string | undefined,
    price as number | undefined
  );
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.json(product);
};

export const remove = (req: Request, res: Response): void => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    res.status(400).json({ error: "Invalid product id" });
    return;
  }
  if (!deleteProduct(id)) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.status(204).send();
};
