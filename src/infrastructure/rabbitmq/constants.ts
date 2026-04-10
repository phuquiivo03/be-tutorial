export enum QueueName {
  TRANSACTION = "transaction",
  QUEUE = "app_jobs",
  DLQ = "jobs_dlq",
  WEB3 = "w3__jobs",
  RESIZE = "resize__jobs",
  EXCHANGE = "app_exchange",
  DLX = "dlx.exchange",
  RETRY = "retry__jobs",
  MINT_RETRY = "nft.mint.retryx",
  RESIZE_RETRY = "image.resize.retryx",
  TRANSFER_RETRY = "transaction.transfer.retryx",
}

export enum MQActions {
  RESIZE = "image.resize",
  MINT = "nft.mint",
  TRANSFER = "transaction.transfer",
}

export enum RoutingKey {
  RESIZE = "image.resize",
  MINT = "nft.mint",
  TRANSFER = "transaction.transfer",
  DLQ = "dlq",
}

export const Queue = {
  maxRetries: 3,
};
