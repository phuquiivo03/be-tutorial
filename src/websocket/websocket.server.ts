import { Server as HTTPServer } from "http";
import { WebSocketServer } from "ws";
import { handleConnection } from "./connection/connection.handlers";
import { authenSocketConnection } from "./middleware/auth";

export const setupWebSocket = (server: HTTPServer) => {
  const wss = new WebSocketServer({
    noServer: true,
  });

  server.on("upgrade", async (request, socket, head) => {
    try {
      const userData = await authenSocketConnection(request);
      wss.handleUpgrade(request, socket, head, (ws) => {
        handleConnection(ws, userData, request);
      });
    } catch (error) {
      socket.destroy();
    }
  });
};
