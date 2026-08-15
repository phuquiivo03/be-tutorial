import { CustomExpress } from "../../pkg/app/response";
import { ErrorStatusCode } from "../../shared/errors/errorCode";
import JobService from "./job.service";
import { NextFunction, Request, Response } from "express";
export const getJobById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const customExpress = new CustomExpress(req, res, next);
  try {
    const { id } = req.params as { id: string };
    const job = await JobService.find(id);
    customExpress.response200({ data: job });
  } catch (error) {
    customExpress.response500(ErrorStatusCode.INTERNAL_SERVER_ERROR, {
      message: "Failed to get job",
      error,
    });
  }
};
