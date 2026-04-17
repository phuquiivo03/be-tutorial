import express from "express";
import router from "./router";
import "dotenv/config";
import "./workers/";
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
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

// docker run -d \
//   --hostname rabbit \
//   --name rabbitmq \
//   -p 5672:5672 \
//   -p 15672:15672 \
//   rabbitmq:3-management
