import { Prisma } from "@prisma/client";
import { FindManyOptions } from "../../shared/types/query";

export type FindManyEntriesOptions = FindManyOptions<
  Prisma.EntryWhereInput,
  Prisma.EntryOrderByWithRelationInput
>;
