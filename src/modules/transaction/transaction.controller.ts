import { Request, Response, RequestHandler } from "express";
import { Transfer } from "./transaction.type";
import TransactionService from "./transaction.service";
import EntryService from "../entry/entry.service";
import AccountService from "../account/account.service";
import { appConfig } from "../../config";
import { Prisma } from "@prisma/client";
import { TransferRoles } from "./transaction.constants";
export const transfer = async (req: Request, res: Response) => {
  try {
    const data: Transfer = req.body;
    // check sender balance
    const senderAccount = await AccountService.findByUserId(data.fromUserId);
    const receiverAccount = await AccountService.findByUserId(data.toUserId);
    if (!senderAccount || !receiverAccount) {
      throw new Error("Sender or receiver account not found!");
    }
    const senderBalance = await EntryService.getBalanceByAccountId(
      senderAccount.id,
    );
    if (senderBalance.lessThan(Prisma.Decimal(data.amount.toString()))) {
      throw new Error("Insufficient balance!");
    }
    const transaction = await TransactionService.create(data);
    const senderEntry = await EntryService.create({
      transactionId: transaction.id,
      accountId: senderAccount.id,
      amount: Prisma.Decimal(-data.amount),
      role: TransferRoles.SENDER,
    });
    const receiverEntry = await EntryService.create({
      transactionId: transaction.id,
      accountId: receiverAccount.id,
      amount: Prisma.Decimal(data.amount.toString()),
      role: TransferRoles.RECEIVER,
    });
    if (!senderEntry || !receiverEntry) {
      throw new Error("Transaction Failed!");
    }
    //update transaction status to success
    await TransactionService.update(transaction.id, "success");
    res.status(200).json({
      message: "Transaction Successful!",
      data: { transaction, senderEntry, receiverEntry },
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: (error as Error).message,
    });
  }
};
