import { IncomingMessage } from "http";
import { RawData, WebSocket } from "ws";
import { verifyAndGetAuthUser } from "../../shared/middlewares/helper";
import { RequestUser } from "../../modules/user/user.type";
import connectionManager from "./connection.manager";
import { websocketRoute } from "../route";
import { WebSocketMessage } from "../types";
export const handleConnection = async (
  wss: WebSocket,
  user: RequestUser,
  request: IncomingMessage,
) => {
  // handle connect
  connectionManager.add(user.id, wss);
  // handle message
  wss.on("message", (data: RawData) => {
    const message = JSON.parse(data.toString()) as WebSocketMessage;
    const handler = websocketRoute[message.event];
    handler(wss, user, message);
  });
  // handle close
  wss.on("close", () => {
    connectionManager.remove(user.id);
  });
};
