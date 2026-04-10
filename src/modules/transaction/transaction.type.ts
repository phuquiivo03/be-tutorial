import {
  TransactionSchema,
  EntrySchema,
  transferSchema,
  CreateEntrySchema,
} from "./transaction.schema";
import { z } from "zod";
export type Transfer = z.infer<typeof transferSchema>;
export type Transaction = z.infer<typeof TransactionSchema>;
export type Entry = z.infer<typeof EntrySchema>;
export type CreateEntry = z.infer<typeof CreateEntrySchema>;
export type Currency = {
  name: string;
  symbol: string;
  breakdown: number;
};

