import express from "express";
import http from "http";
import { setupWebSocket } from "./websocket";

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());
const server = http.createServer(app);

setupWebSocket(server);

server.listen(PORT, () => {
  console.log(`HTTP server running on port ${PORT}`);
  console.log(`WebSocket server running on ws://localhost:${PORT}/ws`);
});
