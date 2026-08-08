import { RawData, WebSocket } from "ws";
import { WebSocketMessage, WebsocketNotification } from "../types";

export const handleMessage = (socket: WebSocket, data: RawData) => {
  try {
    const message: WebSocketMessage<WebsocketNotification> = JSON.parse(
      data.toString(),
    );

    console.log("Event:", message.event);
    console.log("Data:", message.data);

    switch (message.event) {
      case "ping":
        socket.send(
          JSON.stringify({
            event: "pong",
          }),
        );
        break;

      default:
        socket.send(
          JSON.stringify({
            event: "error",
            message: "Unknown event",
          }),
        );
    }
  } catch {
    socket.send(
      JSON.stringify({
        event: "error",
        message: "Invalid message format",
      }),
    );
  }
};
