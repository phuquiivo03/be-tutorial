// worker/worker.ts
import { connectQueue } from "../infrastructure/rabbitmq/connect";
import { QueueName, Queue } from "../infrastructure/rabbitmq/constants";
import JobService from "../modules/job/job.service";
import { JobStatus } from "../modules/job/job.dto";
import amqp from "amqplib";
import { Job } from "../modules/job/job.type";
export async function handleRetry(
  msg: amqp.Message,
  channel: amqp.Channel,
  retryQueueName: QueueName,
) {
  try {
    const data = JSON.parse(msg.content.toString());
    const retries = msg.properties.headers?.["x-retry-count"] || 0;
    if (retries >= Queue.maxRetries) {
      handleCancelJob(data.id, msg, channel);
      return;
    }
    console.log("Retrying:", retries + 1);
    channel.sendToQueue(retryQueueName, msg.content, {
      headers: { "x-retry-count": retries + 1 },
    });
    channel.ack(msg);
  } catch (error) {
    throw error;
  }
}

export async function handlePendingJob(
  msg: amqp.Message,
  channel: amqp.Channel,
  jobId: string,
  excuteJob: () => Promise<void>,
  retryQueueName: QueueName,
) {
  try {
    const job: Job = await JobService.get(jobId);
    if (job && job.status === JobStatus.PENDING) {
      await excuteJob();
      await JobService.update(jobId, JobStatus.COMPLETED);
      channel.ack(msg as amqp.Message);
    }
  } catch (error) {
    console.error(error.message);
    handleRetry(msg, channel, retryQueueName);
  }
}

export async function handleCancelJob(
  jobId: string,
  msg: amqp.Message,
  channel: amqp.Channel,
) {
  console.log("Removing job:", jobId);
  await JobService.update(jobId, JobStatus.FAILED);
  channel.nack(msg, false, false);
}
