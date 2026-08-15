import prisma from "../../infrastructure/prisma/connect";
import {
  CreateUserInput,
  FindManyUsersOptions,
  UpdateUserInput,
  User,
} from "./user.type";
import { parseOrThrow } from "../../utils";
import { userSchema } from "./user.schema";
import { ErrorMessages } from "../../shared/errors/errorMessage";
import { defaultCurrency } from "../transaction";
import { hash } from "../../utils/hashing";
import { Prisma } from "@prisma/client";

class UserService {
  async createUser(input: CreateUserInput): Promise<User> {
    try {
      const hashedPassword = await hash(input.password);
      const user = await prisma.user.create({
        data: {
          name: input.name,
          password: hashedPassword,
          phoneNumber: input.phoneNumber,
          email: "",
          account: {
            create: {
              currency: defaultCurrency.symbol,
            },
          },
        },
        include: { account: true },
      });
      if (!user) {
        throw new Error(ErrorMessages.FAILED_TO_CREATE_USER);
      }

      return parseOrThrow<User>(userSchema, user);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getUser(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      include: { account: true },
    });
  }

  async find(filter: Prisma.UserWhereInput) {
    return prisma.user.findFirst({
      where: filter,
      include: { account: true },
    });
  }

  async findAll(options: FindManyUsersOptions) {
    return prisma.user.findMany(options);
  }

  async updateUser(userId: string, input: UpdateUserInput) {
    const userData = {
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.email !== undefined ? { email: input.email } : {}),
      ...(input.password !== undefined ? { password: input.password } : {}),
    };

    await prisma.user.update({
      where: { id: userId },
      data: userData,
    });

    return this.getUser(userId);
  }

  async createAccount(userId: string, currency?: string) {
    return prisma.account.create({
      data: {
        userId,
        currency: currency || defaultCurrency.symbol,
      },
    });
  }

  async getAccount(userId: string) {
    return prisma.account.findUnique({
      where: { userId },
    });
  }

  async updateAccount(userId: string, currency: string) {
    return prisma.account.update({
      where: { userId },
      data: { currency },
    });
  }
}

export default new UserService();
