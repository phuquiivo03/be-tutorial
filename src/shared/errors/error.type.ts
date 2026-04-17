import amqp from "amqplib";
import { QueueName } from "../../infrastructure/rabbitmq/constants";
import { ErrorCodes, ErrorStrategyCodes } from "./errorCode";
export type ErrorStrategy = (ctx: WorkerContext) => Promise<void>;
export type WorkerContext = {
  channel: amqp.Channel;
  msg: amqp.Message;
  data: any;
  retryQueue: QueueName;
};

export type ErrorStrategyValues =
  (typeof ErrorStrategyCodes)[keyof typeof ErrorStrategyCodes];
export type ErrorCodeValues = (typeof ErrorCodes)[keyof typeof ErrorCodes];
