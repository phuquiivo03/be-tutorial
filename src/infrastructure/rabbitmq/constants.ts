export enum QueueName {
  QUEUE = "app_jobs",
  DLQ = "jobs_dlq",
  WEB3 = "w3__jobs",
  RESIZE = "resize__jobs",
  EXCHANGE = "app_exchange",
  DLX = "dlx.exchange",
  RETRY = "retry__jobs",
  MINT_RETRY = "nft.mint.retryx",
  RESIZE_RETRY = "image.resize.retryx",
}

export enum MQActions {
  RESIZE = "image.resize",
  MINT = "nft.mint",
}

export enum RoutingKey {
  RESIZE = "image.resize",
  MINT = "nft.mint",

  DLQ = "dlq",
}

export const Queue = {
  maxRetries: 3,
};
