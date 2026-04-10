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
  await queueFactory(channel, QueueName.DLQ, RoutingKey.DLQ, { durable: true });
  // resize queue
  await queueFactory(channel, QueueName.RESIZE, RoutingKey.RESIZE, {
    durable: true,
    deadLetterExchange: QueueName.DLX,
    deadLetterRoutingKey: RoutingKey.DLQ,
  });
  // web3 queue
  await queueFactory(channel, QueueName.WEB3, RoutingKey.MINT, {
    durable: true,
    deadLetterExchange: QueueName.DLX,
    deadLetterRoutingKey: RoutingKey.DLQ,
  });
  // transaction queue
  await queueFactory(channel, QueueName.TRANSACTION, RoutingKey.TRANSFER, {
    durable: true,
    deadLetterExchange: QueueName.DLX,
    deadLetterRoutingKey: RoutingKey.DLQ,
  });
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

  await channel.assertQueue(QueueName.TRANSFER_RETRY, {
    durable: true,
    messageTtl: 5000,
    deadLetterExchange: QueueName.EXCHANGE,
    deadLetterRoutingKey: RoutingKey.TRANSFER,
  });
  return channel;
}

async function queueFactory(
  channel: amqp.Channel,
  queueName: QueueName,
  routingKey: RoutingKey,
  options?: amqp.Options.AssertQueue,
) {
  await channel.assertQueue(queueName, options);
  await channel.bindQueue(queueName, QueueName.EXCHANGE, routingKey);
}
