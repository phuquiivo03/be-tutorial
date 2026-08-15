import { Prisma } from "@prisma/client";

export type FindManyOptions<T, Q> = {
  where: T;
  skip?: number;
  take?: number;
  orderBy?: Q;
};

export type FindManyQueryParam = { page: number; limit: number };
