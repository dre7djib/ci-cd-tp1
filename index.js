const express = require("express");

const app = express();
const port = parseInt(process.env.PORT || "3000", 10);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`API listening on port ${port}`);
});

