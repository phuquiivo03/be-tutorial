import amqp from "amqplib";
import { MQActions, QueueName, RoutingKey } from "./constants";
import { connectQueue } from "./connect";

export async function publishMessage(
  routingKey: RoutingKey | MQActions,
  message: string,
  properties?: amqp.Options.Publish,
) {
  const channel = await connectQueue();
  (channel as amqp.Channel).publish(
    QueueName.EXCHANGE,
    routingKey,
    Buffer.from(message),
    { persistent: true, ...properties },
  );
}
