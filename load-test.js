import http from "k6/http";
import { check, sleep } from "k6";

const BASE_URL = __ENV.BASE_URL || "http://localhost:3000";

export const options = {
  vus: 10, // 10 utilisateurs virtuels
  duration: "10s",
  thresholds: {
    // 800ms pour tolérer les cold starts Render et la latence réseau en CI
    http_req_duration: ["p(95)<800"],
    http_req_failed: ["rate<0.01"],   // < 1% d'échecs
  },
};

export default function () {
  // Test de la route /health
  const healthRes = http.get(`${BASE_URL}/health`);
  check(healthRes, {
    "health status 200": (r) => r.status === 200,
    "health has ok": (r) => r.json("status") === "ok",
  });

  // Test de la route GET /products
  const productsRes = http.get(`${BASE_URL}/products`);
  check(productsRes, {
    "products status 200": (r) => r.status === 200,
  });

  sleep(0.5); // Pause entre les requêtes pour simuler un comportement réaliste
}
