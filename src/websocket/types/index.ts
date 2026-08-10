import { type EventType } from "./event.type";
export interface WebSocketMessage<T = unknown> {
  event: EventType;
  data?: T;
}

export type WebsocketNotification = {
  message: string;
  variant: string;
};

export * from "./event.type";
