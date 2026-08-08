export interface WebSocketMessage<T = unknown> {
  event: string;
  data?: T;
}

export type WebsocketNotification = {
  message: string;
  variant: string;
};
