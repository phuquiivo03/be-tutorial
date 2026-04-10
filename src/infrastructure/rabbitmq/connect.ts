import amqp from "amqplib";
import { QueueName, RoutingKey } from "./constants";

var channel: amqp.Channel;

export async function connectQueue() {
  if (channel) return channel as amqp.Channel;
  const conn = await amqp.connect("amqp://localhost");
  channel = await conn.createChannel();
  channel.prefetch(1);
  // Exchange chính
  await channel.assertExchange(QueueName.EXCHANGE, "direct", { durable: true });
  // DLX
  await channel.assertExchange(QueueName.DLX, "direct", { durable: true });
  // DLQ
  await channel.assertQueue(QueueName.DLQ, { durable: true });
  await channel.bindQueue(QueueName.DLQ, QueueName.DLX, RoutingKey.DLQ);
  // resize queue
  await channel.assertQueue(QueueName.RESIZE, {
    durable: true,
    deadLetterExchange: QueueName.DLX,
    deadLetterRoutingKey: RoutingKey.DLQ,
  });
  await channel.bindQueue(
    QueueName.RESIZE,
    QueueName.EXCHANGE,
    RoutingKey.RESIZE,
  );
  // web3 queue
  await channel.assertQueue(QueueName.WEB3, {
    durable: true,
    deadLetterExchange: QueueName.DLX,
    deadLetterRoutingKey: RoutingKey.DLQ,
  });
  await channel.bindQueue(QueueName.WEB3, QueueName.EXCHANGE, RoutingKey.MINT);
  // retry queue
  await channel.assertQueue(QueueName.MINT_RETRY, {
    durable: true,
    messageTtl: 5000,
    deadLetterExchange: QueueName.EXCHANGE,
    deadLetterRoutingKey: RoutingKey.MINT,
  });
  await channel.assertQueue(QueueName.RESIZE_RETRY, {
    durable: true,
    messageTtl: 5000,
    deadLetterExchange: QueueName.EXCHANGE,
    deadLetterRoutingKey: RoutingKey.RESIZE,
  });
  return channel;
}
