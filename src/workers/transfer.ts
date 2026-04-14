import { connectQueue } from "../infrastructure/rabbitmq/connect";
import { QueueName, RoutingKey } from "../infrastructure/rabbitmq/constants";
import { parseOrThrow } from "../utils";
import { transferSchema } from "../modules/transaction/transaction.schema";
import { Transfer } from "../modules/transaction/transaction.type";
import { Job } from "../modules/job/job.type";
import TransactionService from "../modules/transaction/transaction.service";
import EntryService from "../modules/entry/entry.service";
import TransactionHelper from "../modules/transaction/transaction.helper";
import { Prisma } from "@prisma/client";
import { TransactionStatus, TransferRoles } from "../modules/transaction";
import amqp from "amqplib";
import { ErrorMessages } from "../shared/errors/error-message";
import { handleRetry, handlePendingJob, handleCancelJob } from "./helper";
import JobService from "../modules/job/job.service";
import { JobStatus } from "../modules/job/job.dto";
import { JobHelper } from "../modules/job";
import prisma from "../infrastructure/prisma/connect";
export const transferWorker = async () => {
  const channel = await connectQueue();
  channel.consume(QueueName.TRANSACTION, async (msg) => {
    await handleError(msg as amqp.Message, channel, async () => {
      const data = JSON.parse(msg?.content.toString() || "{}") as Job;
      //block job
      const updated = await JobService.updateAndCount(
        data.id,
        JobStatus.PROCESSING,
      );
      // if job is not updated, throw error (re-excute job)
      if (updated === 0) throw new Error(ErrorMessages.JOB_UPDATED_FAILED);
      const job = await JobService.get(data.id);
      await processTransaction(job);
      // update job status to completed
      await JobService.update(job.id, JobStatus.COMPLETED);
      // ack the message
      channel.ack(msg as amqp.Message);
      console.log("Transaction completed");
    });
  });
};

async function handleError(
  msg: amqp.Message,
  channel: amqp.Channel,
  callback: () => Promise<void>,
) {
  try {
    return await Promise.resolve(callback());
  } catch (error) {
    const data = JSON.parse(msg.content.toString());
    console.error("Error in handleError", error.message);
    switch (error.message) {
      case ErrorMessages.FAILED_TO_CREATE_ENTRY:
        handleRetry(msg, channel, QueueName.TRANSFER_RETRY);
        break;
      case ErrorMessages.FAILED_TO_CREATE_JOB:
        handlePendingJob(
          msg,
          channel,
          data.id,
          async () => {
            await TransactionService.create(data);
          },
          QueueName.TRANSFER_RETRY,
        );
        break;
      default:
        handleCancelJob(data.id, msg, channel);
        break;
    }
  }
}

async function processTransaction(data: Job) {
  const transferData = parseOrThrow<Transfer>(transferSchema, data.data);
  await prisma.$transaction(async (tx) => {
    const { senderAccount, receiverAccount } =
      await TransactionHelper.validTRansfer(transferData);
    const transaction = await TransactionService.create(transferData, tx);
    const senderEntry = await EntryService.create({
      transactionId: transaction.id,
      accountId: senderAccount.id,
      amount: Prisma.Decimal(-transferData.amount),
      role: TransferRoles.SENDER,
    });
    const receiverEntry = await EntryService.create({
      transactionId: transaction.id,
      accountId: receiverAccount.id,
      amount: Prisma.Decimal(transferData.amount.toString()),
      role: TransferRoles.RECEIVER,
    });
    if (!senderEntry || !receiverEntry) {
      throw new Error(ErrorMessages.FAILED_TO_CREATE_ENTRY);
    }
    //update transaction status to success
    await TransactionService.update(
      transaction.id,
      TransactionStatus.COMPLETED,
      tx,
    );
  });
}
