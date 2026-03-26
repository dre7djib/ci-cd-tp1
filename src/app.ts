import express, { Application } from "express";
import { pingSupabase } from "./config/db";
import { pingRedis } from "./config/redis";
import productRoutes from "./routes/product.routes";

const app: Application = express();

app.use(express.json());

/** Liveness: process is up (no dependency checks). */
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

/** Readiness: Redis + DB reachable so traffic is not routed to a half-dead instance. */
app.get("/health/ready", async (_req, res) => {
  const [redis, supabase] = await Promise.all([pingRedis(), pingSupabase()]);
  const ready = redis && supabase;
  res.status(ready ? 200 : 503).json({
    status: ready ? "ready" : "not_ready",
    redis,
    supabase,
  });
});

app.use("/products", productRoutes);

export default app;
