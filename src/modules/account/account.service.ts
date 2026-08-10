import prisma from "../../infrastructure/prisma/connect";
import { parseOrThrow } from "../../utils";
import { accountSchema } from "./account.schema";
import { Account } from "./account.type";
import { ErrorMessages } from "../../shared/errors/errorMessage";
import { Prisma } from "@prisma/client";
import { AppError } from "../../shared/errors/Error";
import { ErrorCodes, ErrorStatusCode } from "../../shared/errors/errorCode";

class AccountService {
  async createAccount(userId: string, currency: string) {
    try {
      const account = await prisma.account.create({
        data: { userId, currency },
      });
      return parseOrThrow<Account>(accountSchema, account);
    } catch (error) {
      throw new AppError(
        ErrorCodes.FAILED_TO_CREATE_ACCOUNT,
        ErrorMessages.FAILED_TO_CREATE_ACCOUNT,
        ErrorStatusCode.BAD_REQUEST,
        false,
      );
    }
  }

  async findById(id: string): Promise<Account> {
    const account = await prisma.account.findUnique({
      where: { id },
    });
    return parseOrThrow<Account>(accountSchema, account);
  }

  async findByUserId(userId: string): Promise<Account> {
    const account = await prisma.account.findUnique({
      where: { userId },
    });
    if (!account) {
      throw new AppError(
        ErrorCodes.BAD_REQUEST,
        ErrorMessages.ACCOUNT_NOT_FOUND,
        ErrorStatusCode.BAD_REQUEST,
      );
    }
    return parseOrThrow<Account>(accountSchema, account);
  }
  async lockAccount(id: string, tx: Prisma.TransactionClient): Promise<void> {
    await tx.$queryRaw`
            SELECT * FROM "Account" WHERE id = ${id} FOR UPDATE
          `;
  }
}

export default new AccountService();
