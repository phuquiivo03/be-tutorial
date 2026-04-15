import prisma from "../../infrastructure/prisma/connect";
import { parseOrThrow } from "../../utils";
import { accountSchema } from "./account.schema";
import { Account } from "./account.type";
import { ErrorMessages } from "../../shared/errors/error-message";
import { Prisma } from "@prisma/client";
import { AppError } from "../../shared/errors/Error";
import { ErrorCodes } from "../../shared/errors/error-code";

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
    return parseOrThrow<Account>(accountSchema, account);
  }
  async lockAccount(id: string, tx: Prisma.TransactionClient): Promise<void> {
    await tx.$queryRaw`
            SELECT * FROM "Account" WHERE id = ${id} FOR UPDATE
          `;
  }
}

export default new AccountService();
