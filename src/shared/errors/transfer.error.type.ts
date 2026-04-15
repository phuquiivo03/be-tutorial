import amqp from "amqplib";
import { QueueName } from "../../infrastructure/rabbitmq/constants";
export type ErrorStrategy = (ctx: WorkerContext) => Promise<void>;
export type WorkerContext = {
  channel: amqp.Channel;
  msg: amqp.Message;
  data: any;
  retryQueue: QueueName;
};
