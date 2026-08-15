import prisma from "../../infrastructure/prisma/connect";
import { parseOrThrow } from "../../utils";
import { EntrySchema, CreateEntry, Entry } from "../transaction";
import { Prisma } from "@prisma/client";
import { FindManyEntriesOptions } from "./entry.type";

class EntryService {
  async create(
    data: CreateEntry,
    tx?: Prisma.TransactionClient,
  ): Promise<Entry> {
    const entry = await (tx || prisma).entry.create({
      data: {
        ...data,
      },
    });
    return parseOrThrow<Entry>(EntrySchema, entry);
  }

  async createMany(
    data: CreateEntry[],
    tx?: Prisma.TransactionClient,
  ): Promise<number> {
    const entries = await (tx || prisma).entry.createMany({
      data,
    });
    return entries.count;
  }

  async get(entryId: string): Promise<Entry> {
    const entry = await prisma.entry.findUnique({
      where: { id: entryId },
    });
    return parseOrThrow<Entry>(EntrySchema, entry);
  }

  async getEntriesByAccountId(accountId: string): Promise<Entry[]> {
    const entries = await prisma.entry.findMany({
      where: { accountId },
    });
    return parseOrThrow<Entry[]>(EntrySchema.array(), entries);
  }

  async getBalanceByAccountId(accountId: string): Promise<Prisma.Decimal> {
    const result = await this.getEntriesByAccountId(accountId);
    return result.reduce(
      (acc, entry) => acc.add(entry.amount),
      Prisma.Decimal("0"),
    );
  }

  async findMany(options: FindManyEntriesOptions): Promise<Entry[]> {
    return prisma.entry.findMany(options);
  }
}
export default new EntryService();
