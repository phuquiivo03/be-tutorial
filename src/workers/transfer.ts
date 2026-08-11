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
import { ErrorMessages } from "../shared/errors/errorMessage";
import JobService from "../modules/job/job.service";
import { JobStatus } from "../modules/job/job.dto";
import prisma from "../infrastructure/prisma/connect";
import { AccountService } from "../modules/account";
import { ErrorCodes } from "../shared/errors/errorCode";
import { AppError } from "../shared/errors/Error";
import {
  getErrorStrategy,
  normalizeError,
} from "../shared/errors/error.helper";
import websocketGateway from "../websocket/gateway/websocket.gateway";
import { sendTransactionNotification } from "./helper";

export const transferWorker = async () => {
  const channel = await connectQueue();
  channel.consume(QueueName.TRANSACTION, async (msg) => {
    await handleError(msg as amqp.Message, channel, async () => {
      // const random = Math.random(); // simulate error -> retry job
      // console.log(random);
      // if (random < 0.5) {
      //   throw new AppError(
      //     ErrorCodes.FAILED_TO_CREATE_ENTRY,
      //     ErrorMessages.FAILED_TO_CREATE_ENTRY,
      //   );
      // }
      const data = JSON.parse(msg?.content.toString() || "{}") as Job;
      //block job
      const updated = await JobService.updateAndCount(
        data.id,
        JobStatus.PROCESSING,
      );
      // if job is not updated, throw error (re-excute job)
      const j = await JobService.get(data.id);
      console.log(j);
      if (updated === 0)
        throw new AppError(
          ErrorCodes.JOB_UPDATED_FAILED,
          ErrorMessages.JOB_UPDATED_FAILED,
        );
      const job = await JobService.get(data.id);
      const transferData = await processTransaction(job);
      // update job status to completed
      // if worker crash here, the job will be re-excute by the worker
      // if crash here, the job will be pending forever (not re-excute, not failed)
      await JobService.update(job.id, JobStatus.COMPLETED);
      const random2 = Math.random(); // simulate error -> retry job
      // if (random2 < 0.7) {
      //   console.log("Simulate error -> \nWorker Crashed!");
      //   process.exit(1);
      // }
      // ack the message
      channel.ack(msg as amqp.Message);
      console.log("Transaction completed");
      // send notification -> sender
      await sendTransactionNotification(transferData);
    });
  });
};

async function handleError(
  msg: amqp.Message,
  channel: amqp.Channel,
  callback: () => Promise<void>,
) {
  const data = JSON.parse(msg.content.toString());
  try {
    return await Promise.resolve(callback());
  } catch (error) {
    const err: AppError = normalizeError(error);
    console.error("Error in handleError", err.code, "message:", err.message);

    const strategy = getErrorStrategy(err.code);
    await strategy({
      channel,
      msg,
      data,
      retryQueue: QueueName.TRANSFER_RETRY,
    });
  }
}

async function processTransaction(data: Job): Promise<Transfer> {
  const transferData = parseOrThrow<Transfer>(transferSchema, data.data);
  await prisma.$transaction(async (tx) => {
    const { senderAccount, receiverAccount } =
      await TransactionHelper.validTRansfer(transferData);
    // lock accounts
    await AccountService.lockAccount(senderAccount.id, tx);
    await AccountService.lockAccount(receiverAccount.id, tx);
    const transaction = await TransactionService.create(transferData, tx);
    const entries = await EntryService.createMany(
      [
        {
          transactionId: transaction.id,
          accountId: senderAccount.id,
          amount: Prisma.Decimal(-transferData.amount),
          role: TransferRoles.SENDER,
        },
        {
          transactionId: transaction.id,
          accountId: receiverAccount.id,
          amount: Prisma.Decimal(transferData.amount.toString()),
          role: TransferRoles.RECEIVER,
        },
      ],
      tx,
    );
    if (entries !== 2) {
      throw new AppError(
        ErrorCodes.FAILED_TO_CREATE_ENTRY,
        ErrorMessages.FAILED_TO_CREATE_ENTRY,
      );
    }
    //update transaction status to success
    await TransactionService.update(
      transaction.id,
      TransactionStatus.COMPLETED,
      tx,
    );
  });
  return transferData;
}
