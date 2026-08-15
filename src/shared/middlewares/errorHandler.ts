import { NextFunction, Request, RequestHandler, Response } from "express";
import { AppError } from "../errors/Error";
import { ErrorStatusCode } from "../errors/errorCode";
import { CustomExpress } from "../../pkg/app/response";
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const customExpress = new CustomExpress(req, res, next);
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
    if (err.statusCode == 400) {
      customExpress.response400(ErrorStatusCode.BAD_REQUEST, {
        reason: err.message,
      });
    } else {
      customExpress.response500(ErrorStatusCode.INTERNAL_SERVER_ERROR, {
        reason: err.message,
      });
    }
    return;
  }

  customExpress.response500(ErrorStatusCode.INTERNAL_SERVER_ERROR, {
    reason: err.message,
  });
};

export const asyncHandler =
  (fn: RequestHandler) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);
