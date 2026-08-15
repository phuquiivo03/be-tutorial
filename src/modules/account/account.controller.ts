import { NextFunction, Request, Response } from "express";
import EntryService from "../entry/entry.service";
import { convertMoney } from "../../utils";
import accountService from "./account.service";
import { CustomExpress } from "../../pkg/app/response";
export const getAccountBalance = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const customExpress = new CustomExpress(req, res, next);
    const accountId = req.params.accountId as string;
    if (!accountId) {
      throw new Error("User ID is required!");
    }
    const account = await accountService.findById(accountId);
    if (!account) {
      throw new Error("Account not found!");
    }
    const balance = await EntryService.getBalanceByAccountId(accountId);
    const displayBalance = convertMoney(balance, account.currency);
    customExpress.response200({
      balance: displayBalance,
    });
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
  }
};
