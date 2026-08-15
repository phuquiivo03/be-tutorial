import { Request, Response, RequestHandler, NextFunction } from "express";
import { Transfer } from "./transaction.type";
import JobService from "../job/job.service";
import TransactionHelper from "./transaction.helper";
import { MQActions } from "../../infrastructure/rabbitmq/constants";
import { AppError, ErrorCodes, ErrorMessages } from "../../shared/errors";
import { ErrorStatusCode } from "../../shared/errors/errorCode";
import entryService from "../entry/entry.service";
import { FindManyQueryParam } from "../../shared/types/query";
import { FindManyEntriesOptions } from "../entry/entry.type";
import { CustomExpress } from "../../pkg/app/response";
export const transfer = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const customExpress = new CustomExpress(req, res, next);
  const data: Transfer = req.body;
  // check sender balance
  await TransactionHelper.validTRansfer(data);
  const job = await JobService.createAnndPublish({
    action: MQActions.TRANSFER,
    data: data as unknown as JSON,
  });
  customExpress.response200(job);
};

export const getHistoryByUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const customExpress = new CustomExpress(req, res, next);
  try {
    const queryParams: FindManyQueryParam = JSON.parse(
      req.query.options as string,
    ) || {
      page: 1,
      limit: 10,
    };
    // @ts-ignore
    const user = req.user;
    if (!user) {
      throw new AppError(
        ErrorCodes.BAD_REQUEST,
        ErrorMessages.UN_AUTHORISED,
        ErrorStatusCode.BAD_REQUEST,
      );
    }
    const findOptions: FindManyEntriesOptions = {
      where: {
        account: {
          userId: user.id,
        },
      },
      skip: (queryParams.page - 1) * queryParams.limit,
      take: queryParams.limit,
      orderBy: {
        createdAt: "desc",
      },
    };
    const entries = await entryService.findMany(findOptions);
    customExpress.response200(entries);
  } catch (e) {
    throw new AppError(
      ErrorCodes.INTERNAL_SERVER_ERROR,
      (e as Error).message,
      ErrorStatusCode.INTERNAL_SERVER_ERROR,
    );
  }
};
