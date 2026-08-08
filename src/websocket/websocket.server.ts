import { Server as HTTPServer } from "http";
import { WebSocketServer } from "ws";

import { handleConnection } from "./handlers/connection.handlers";
import { handleMessage } from "./handlers/message.handlers";

export const setupWebSocket = (server: HTTPServer) => {
  const wss = new WebSocketServer({
    server,
    path: "/ws",
  });

  wss.on("connection", (socket, request) => {
    handleConnection(socket, request);

    socket.on("message", (data) => {
      handleMessage(socket, data);
    });

    socket.on("close", () => {
      console.log("Client disconnected");
    });
  });
};
