import prisma from "../../infrastructure/prisma/connect";
import { Transaction, Transfer } from "./transaction.type";
import { TransactionSchema } from "./transaction.schema";
import { parseOrThrow } from "../../utils";
import { Prisma } from "@prisma/client";

class TransactionService {
  async create(
    data: Transfer,
    tx?: Prisma.TransactionClient,
  ): Promise<Transaction> {
    const transaction = await (tx || prisma).transaction.create({
      data: {
        type: "transfer",
        status: "pending",
        message: data.message,
      },
    });
    return parseOrThrow<Transaction>(TransactionSchema, transaction);
  }

  async transfer(data: Transfer) {
    const transaction = await prisma.transaction.create({
      data: {
        type: "transfer",
        status: "pending",
      },
    });
  }

  async update(
    transactionId: string,
    status: string,
    tx?: Prisma.TransactionClient,
  ) {
    await (tx || prisma).transaction.update({
      where: { id: transactionId },
      data: { status },
    });
  }
}
export default new TransactionService();
