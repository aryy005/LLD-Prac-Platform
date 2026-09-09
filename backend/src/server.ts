import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createApiRouter } from "./presentation/routes/apiRoutes.js";

dotenv.config();

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: "5mb" }));

  app.get("/health", (_req, res) => {
    res.json({ status: "healthy", service: "lld-practice-backend", timestamp: new Date().toISOString() });
  });

  app.use("/api", createApiRouter());

  return app;
}
