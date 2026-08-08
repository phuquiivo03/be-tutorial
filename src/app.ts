import express from "express";
import router from "./router";
import "dotenv/config";
import "./workers";
import { requestIdMiddleware, requestLogger } from "./shared/middlewares";
import cors from "cors";
import { errorHandler } from "./shared/middlewares/errorHandler";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);
app.use(requestIdMiddleware);
app.use(requestLogger);
app.use(router);
app.use(errorHandler);
export default app;
