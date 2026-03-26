import "dotenv/config";
import app from "./app";
import { connectRedis, disconnectRedis } from "./config/redis";

const port = parseInt(process.env.PORT ?? "3000", 10);

void (async () => {
  await connectRedis();
  const server = app.listen(port, "0.0.0.0", () => {
    console.log(`API listening on port ${port}`);
  });

  const shutdown = (): void => {
    server.close(() => {
      void disconnectRedis();
    });
  };
  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
})();
