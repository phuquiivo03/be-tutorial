import { Request, Response, RequestHandler } from "express";
import { Transfer } from "./transaction.type";
import JobService from "../job/job.service";
import TransactionHelper from "./transaction.helper";
import { MQActions } from "../../infrastructure/rabbitmq/constants";
export const transfer = async (req: Request, res: Response) => {
  const data: Transfer = req.body;
  // check sender balance
  await TransactionHelper.validTRansfer(data);
  const job = await JobService.createAnndPublish({
    action: MQActions.TRANSFER,
    data: data as unknown as JSON,
  });
  res.status(200).json({
    message: "Transaction Successful!",
    data: { ...job },
  });
};
