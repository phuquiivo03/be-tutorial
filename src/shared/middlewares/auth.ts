import { NextFunction, Request, RequestHandler, Response } from "express";
import JWTService from "../../utils/jwt";
import { IAuthenJWT, AuthJWTSchema } from "../types/auth";
import { AppError, ErrorCodes, ErrorMessages } from "../errors";
import { ErrorStatusCode } from "../errors/errorCode";
import { parseOrThrow } from "../../utils";
import userService from "../../modules/user/user.service";
import createRedis from "../../infrastructure/redis/connect";
import { RequestUser } from "../../modules/user/user.type";
import { appConfig } from "../../config";

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
  const redisClient = await createRedis;
  const blacklistToken = await redisClient.get(
    appConfig.redis.key.authToken(authToken),
  );
  if (blacklistToken !== null) {
    throw new AppError(
      ErrorCodes.BAD_REQUEST,
      ErrorMessages.UN_AUTHORISED,
      ErrorStatusCode.UNAUTHORIZED,
    );
  }
  const authenData: IAuthenJWT = JWTService.parseToken<IAuthenJWT>(
    authToken,
    AuthJWTSchema,
  );

  const user = await userService.find({
    id: authenData.id,
  });

  if (!user) {
    throw new AppError(
      ErrorCodes.BAD_REQUEST,
      ErrorMessages.UN_AUTHORISED,
      ErrorStatusCode.UNAUTHORIZED,
    );
  }
  const { password, account, ...reqUser } = user;
  req.user = reqUser;
  req.authToken = authToken;
  next();
};
