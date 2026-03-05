import express, { Application } from "express";
import productRoutes from "./routes/product.routes";

const app: Application = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/products", productRoutes);

export default app;
