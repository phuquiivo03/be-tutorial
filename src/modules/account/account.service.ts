import prisma from "../../infrastructure/prisma/connect";
import { parseOrThrow } from "../../utils";
import { accountSchema } from "./account.schema";
import { Account } from "./account.type";
import { ErrorMessages } from "../../shared/errors/error-message";

class AccountService {
  async createAccount(userId: string, currency: string) {
    try {
      const account = await prisma.account.create({
        data: { userId, currency },
      });
      return parseOrThrow<Account>(accountSchema, account);
    } catch (error) {
      throw new Error(ErrorMessages.FAILED_TO_CREATE_ACCOUNT, { cause: error });
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
}

export default new AccountService();
