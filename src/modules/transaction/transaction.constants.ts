import { Currency } from "./transaction.type";

export enum CurrencyEnum {
  VND = "VND",
  USD = "USD",
}

export const currencies: Record<CurrencyEnum, Currency> = {
  VND: {
    name: "Vietnamese Dong",
    symbol: "VND",
    breakdown: 1,
  },
  USD: {
    name: "United States Dollar",
    symbol: "USD",
    breakdown: 100,
  },
};

export const TransferRoles = {
  RECEIVER: "receiver",
  SENDER: "sender",
};

export const defaultCurrency = currencies.VND;
export const TransactionStatus = {
  PENDING: "pending",
  COMPLETED: "completed",
  FAILED: "failed",
};
