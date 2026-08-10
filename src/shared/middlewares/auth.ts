import { NextFunction, Request, RequestHandler, Response } from "express";
import { AppError, ErrorCodes, ErrorMessages } from "../errors";
import { ErrorStatusCode } from "../errors/errorCode";
import { RequestUser } from "../../modules/user/user.type";
import { verifyAndGetAuthUser } from "./helper";

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: RequestUser;
      authToken?: string;
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // get token -> validate -> next or throw
  const authToken = req.headers["x-token"] as string;
  if (!authToken) {
    throw new AppError(
      ErrorCodes.BAD_REQUEST,
      ErrorMessages.UN_AUTHORISED,
      ErrorStatusCode.UNAUTHORIZED,
    );
  }
  // check blacklist
  const reqUser = await verifyAndGetAuthUser(authToken);
  req.user = reqUser;
  req.authToken = authToken;
  next();
};
