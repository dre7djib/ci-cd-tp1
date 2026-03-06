import { Request, Response } from "express";
import {
  createProduct,
  getProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
} from "../services/service.product";

const UNIQUE_VIOLATION_CODE = "23505";

const handleDbError = (err: unknown, res: Response): boolean => {
  const error = err as { code?: string };
  if (error?.code === UNIQUE_VIOLATION_CODE) {
    res.status(409).json({ error: "Product with this name already exists" });
    return true;
  }
  return false;
};

export const list = async (_req: Request, res: Response): Promise<void> => {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (err) {
    if (handleDbError(err, res)) return;
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    res.status(400).json({ error: "Invalid product id" });
    return;
  }
  try {
    const product = await getProduct(id);
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    res.json(product);
  } catch (err) {
    if (handleDbError(err, res)) return;
    res.status(500).json({ error: "Internal server error" });
  }
};

export const create = async (req: Request, res: Response): Promise<void> => {
  const { name, price } = (req.body as { name?: unknown; price?: unknown }) || {};
  if (typeof name !== "string" || typeof price !== "number") {
    res.status(400).json({ error: "Invalid payload" });
    return;
  }
  try {
    const product = await createProduct(name, price);
    res.status(201).json(product);
  } catch (err) {
    if (handleDbError(err, res)) return;
    res.status(500).json({ error: "Internal server error" });
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
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
  try {
    const product = await updateProduct(
      id,
      name as string | undefined,
      price as number | undefined
    );
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    res.json(product);
  } catch (err) {
    if (handleDbError(err, res)) return;
    res.status(500).json({ error: "Internal server error" });
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    res.status(400).json({ error: "Invalid product id" });
    return;
  }
  try {
    const deleted = await deleteProduct(id);
    if (!deleted) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    res.status(204).send();
  } catch (err) {
    if (handleDbError(err, res)) return;
    res.status(500).json({ error: "Internal server error" });
  }
};
