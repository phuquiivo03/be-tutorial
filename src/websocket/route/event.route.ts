import { EVENT_CODE } from "../events/event.const";
import { EventType, MessageHandler } from "../types";
import { eventHandler } from "../events";
const route: Record<EventType, MessageHandler> = {
  [EVENT_CODE.SEND_NOTIFICATION]: eventHandler[EVENT_CODE.SEND_NOTIFICATION],
};

export default route;
