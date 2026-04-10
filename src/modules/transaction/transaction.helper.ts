import AccountService from "../account/account.service";
import { Transfer } from "./transaction.type";
import EntryService from "../entry/entry.service";
import { Prisma } from "@prisma/client";
import { Account } from "../account/account.type";
import { ErrorMessages } from "../../shared/errors/error-message";

class TransactionHelper {
  async validTRansfer(
    data: Transfer,
  ): Promise<{ senderAccount: Account; receiverAccount: Account }> {
    try {
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
      return { senderAccount, receiverAccount };
    } catch (error) {
      console.error("Error in validTRansfer", error.message);
      throw new Error(ErrorMessages.FAILED_TO_VALID_TRANSFER, { cause: error });
    }
  }
}

export default new TransactionHelper();
