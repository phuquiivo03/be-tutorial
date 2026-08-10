import AccountService from "../account/account.service";
import { Transfer } from "./transaction.type";
import EntryService from "../entry/entry.service";
import { Prisma } from "@prisma/client";
import { Account } from "../account/account.type";
import { ErrorMessages } from "../../shared/errors/errorMessage";
import { ErrorCodes } from "../../shared/errors/errorCode";
import { AppError, BadRequestError } from "../../shared/errors/Error";

class TransactionHelper {
  async validTRansfer(
    data: Transfer,
  ): Promise<{ senderAccount: Account; receiverAccount: Account }> {
    try {
      const senderAccount = await AccountService.findByUserId(data.fromUserId);
      const receiverAccount = await AccountService.findByUserId(data.toUserId);
      if (!senderAccount || !receiverAccount) {
        throw new AppError(
          ErrorMessages.FAILED_TO_FIND_ACCOUNT,
          ErrorMessages.FAILED_TO_FIND_ACCOUNT,
        );
      }
      const senderBalance = await EntryService.getBalanceByAccountId(
        senderAccount.id,
      );
      if (senderBalance.lessThan(Prisma.Decimal(data.amount.toString()))) {
        throw new BadRequestError(
          ErrorCodes.INSUFFICIENT_BALANCE,
          ErrorMessages.INSUFFICIENT_BALANCE,
        );
      }
      return { senderAccount, receiverAccount };
    } catch (error) {
      throw error;
    }
  }
}

export default new TransactionHelper();
