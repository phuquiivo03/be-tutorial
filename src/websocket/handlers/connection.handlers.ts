import { IncomingMessage } from "http";
import { WebSocket } from "ws";

export const handleConnection = (
  socket: WebSocket,
  request: IncomingMessage,
) => {
  console.log("Client connected");
  // auth check
  const url = new URL(request.url ?? "", `http://${request.headers.host}`);
  const authToken = url.searchParams.get("token");
  
  socket.send(
    JSON.stringify({
      event: "connected",
      message: "Connected successfully",
    }),
  );
};
