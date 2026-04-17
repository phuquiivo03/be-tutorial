import { z } from "zod";
import { Prisma } from "@prisma/client";
import { ErrorMessages } from "../../shared/errors/errorMessage";
import { TransactionStatus, TransferRoles } from "./transaction.constants";

const requiredOrInvalid =
  (requiredMessage: string, invalidMessage: string) =>
  (issue: { input?: unknown }) =>
    issue.input === undefined ? requiredMessage : invalidMessage;

export const transferSchema = z.object({
  fromUserId: z.string({
    error: requiredOrInvalid(
      ErrorMessages.TRANSFER_FROM_USER_ID_REQUIRED,
      ErrorMessages.TRANSFER_FROM_USER_ID_INVALID,
    ),
  }),
  toUserId: z.string({
    error: requiredOrInvalid(
      ErrorMessages.TRANSFER_TO_USER_ID_REQUIRED,
      ErrorMessages.TRANSFER_TO_USER_ID_INVALID,
    ),
  }),
  amount: z.number({
    error: requiredOrInvalid(
      ErrorMessages.TRANSFER_AMOUNT_REQUIRED,
      ErrorMessages.TRANSFER_AMOUNT_INVALID,
    ),
  }),
  currency: z
    .string({
      error: ErrorMessages.TRANSFER_CURRENCY_INVALID,
    })
    .default("VND"),
  message: z
    .string({
      error: ErrorMessages.TRANSFER_MESSAGE_INVALID,
    })
    .optional(),
});

export const TransactionSchema = z.object({
  id: z.string({
    error: requiredOrInvalid(
      ErrorMessages.TRANSACTION_ID_REQUIRED,
      ErrorMessages.TRANSACTION_ID_INVALID,
    ),
  }),
  type: z.enum(["transfer", "deposit", "withdraw"] as const, {
    error: requiredOrInvalid(
      ErrorMessages.TRANSACTION_TYPE_REQUIRED,
      ErrorMessages.TRANSACTION_TYPE_INVALID,
    ),
  }),
  status: z.enum(
    [
      TransactionStatus.PENDING,
      TransactionStatus.COMPLETED,
      TransactionStatus.FAILED,
    ] as const,
    {
      error: requiredOrInvalid(
        ErrorMessages.TRANSACTION_STATUS_REQUIRED,
        ErrorMessages.TRANSACTION_STATUS_INVALID,
      ),
    },
  ),
  message: z
    .string({
      error: ErrorMessages.TRANSACTION_MESSAGE_INVALID,
    })
    .optional(),
  createdAt: z.date({
    error: requiredOrInvalid(
      ErrorMessages.TRANSACTION_CREATED_AT_REQUIRED,
      ErrorMessages.TRANSACTION_CREATED_AT_INVALID,
    ),
  }),
  updatedAt: z.date({
    error: requiredOrInvalid(
      ErrorMessages.TRANSACTION_UPDATED_AT_REQUIRED,
      ErrorMessages.TRANSACTION_UPDATED_AT_INVALID,
    ),
  }),
});

export const EntrySchema = z.object({
  id: z.string({
    error: requiredOrInvalid(
      ErrorMessages.ENTRY_ID_REQUIRED,
      ErrorMessages.ENTRY_ID_INVALID,
    ),
  }),
  transactionId: z.string({
    error: requiredOrInvalid(
      ErrorMessages.ENTRY_TRANSACTION_ID_REQUIRED,
      ErrorMessages.ENTRY_TRANSACTION_ID_INVALID,
    ),
  }),
  accountId: z.string({
    error: requiredOrInvalid(
      ErrorMessages.ENTRY_ACCOUNT_ID_REQUIRED,
      ErrorMessages.ENTRY_ACCOUNT_ID_INVALID,
    ),
  }),
  amount: z.union(
    [
      z
        .string()
        .refine((val) => !isNaN(Number(val)), {
          message: ErrorMessages.ENTRY_AMOUNT_INVALID,
        })
        .transform((val) => Prisma.Decimal(val)),
      z.instanceof(Prisma.Decimal, {
        error: ErrorMessages.ENTRY_AMOUNT_INVALID,
      }),
    ],
    {
      error: ErrorMessages.ENTRY_AMOUNT_INVALID,
    },
  ),
  role: z.union(
    [z.literal(TransferRoles.SENDER), z.literal(TransferRoles.RECEIVER)],
    {
      error: requiredOrInvalid(
        ErrorMessages.ENTRY_ROLE_REQUIRED,
        ErrorMessages.ENTRY_ROLE_INVALID,
      ),
    },
  ),
  createdAt: z.date({
    error: requiredOrInvalid(
      ErrorMessages.ENTRY_CREATED_AT_REQUIRED,
      ErrorMessages.ENTRY_CREATED_AT_INVALID,
    ),
  }),
  updatedAt: z.date({
    error: requiredOrInvalid(
      ErrorMessages.ENTRY_UPDATED_AT_REQUIRED,
      ErrorMessages.ENTRY_UPDATED_AT_INVALID,
    ),
  }),
});

export const CreateEntrySchema = EntrySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
