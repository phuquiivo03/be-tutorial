import { NextFunction, Request, RequestHandler, Response } from "express";
import { AppError } from "../errors/Error";
import { ErrorCodes } from "../errors/errorCode";
import { ErrorMessages } from "../errors/errorMessage";
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // normalize error
  if (err instanceof AppError) {
    // log
    console.error({
      code: err.code,
      message: err.message,
      stack: err.stack,
      statusCode: req.path,
    });
    //response
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
      },
    });
    return;
  }
  console.log(typeof err);

  res.status(500).json({
    code: ErrorCodes.INTERNAL_SERVER_ERROR,
    message: ErrorMessages.INTERNAL_SERVER_ERROR,
  });
};

export const asyncHandler =
  (fn: RequestHandler) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);
