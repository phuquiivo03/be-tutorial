import WebSocket from "ws";
import { EVENT_CODE } from "../events/event.const";
import { RequestUser } from "../../modules/user/user.type";
import { WebSocketMessage } from ".";
export type EventType = (typeof EVENT_CODE)[keyof typeof EVENT_CODE];
export type MessageHandler = (
  socket: WebSocket,
  user: RequestUser,
  data: WebSocketMessage,
) => Promise<void>;
