import prisma from "../../infrastructure/prisma/connect";
import { Transaction, Transfer } from "./transaction.type";
import { TransactionSchema } from "./transaction.schema";
import { parseOrThrow } from "../../utils";

class TransactionService {
  async create(data: Transfer): Promise<Transaction> {
    const transaction = await prisma.transaction.create({
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

  async update(transactionId: string, status: string) {
    await prisma.transaction.update({
      where: { id: transactionId },
      data: { status },
    });
  }
}
export default new TransactionService();
