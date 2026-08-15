import { NextFunction, Request, Response } from "express";
import userService from "../user/user.service";
import { compare } from "../../utils/hashing";
import { LoginData } from "./auth.type";
import { AppError, ErrorCodes, ErrorMessages } from "../../shared/errors";
import JWTService from "../../utils/jwt";
import createRedis from "../../infrastructure/redis/connect";
import { appConfig } from "../../config/app.config";
import { ErrorStatusCode } from "../../shared/errors/errorCode";
import { CustomExpress } from "../../pkg/app/response";
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const customExpress = new CustomExpress(req, res, next);
  try {
    const loginData = req.body as LoginData;
    // check
    const user = await userService.find({
      phoneNumber: loginData.phoneNumber,
    });

    if (!user) {
      throw new AppError(
        ErrorMessages.INVALID_CREADENTIAL,
        ErrorMessages.INVALID_CREADENTIAL,
      );
    }
    const isMatch = await compare(loginData.password, user.password);
    if (!isMatch) {
      throw new AppError(
        ErrorMessages.INVALID_CREADENTIAL,
        ErrorMessages.INVALID_CREADENTIAL,
      );
    }
    // create creadit
    // gen token
    const authenToken = JWTService.generateAuthToken(user.id);
    const refeshToken = JWTService.generateFefeshToken(user.id);
    // remove old token
    const redisClient = await createRedis;
    await redisClient.del(appConfig.redis.key.refeshToken(user.id));
    // save new refesh token
    await redisClient.set(
      appConfig.redis.key.refeshToken(user.id),
      refeshToken,
      {
        expiration: {
          type: "EX",
          value: appConfig.redis.expiration,
        },
      },
    );
    const { password, ...responseData } = user;
    customExpress.response200({
      ...responseData,
      authenToken,
      refeshToken,
    });
    // response
  } catch (e) {
    throw new AppError(ErrorCodes.INTERNAL_SERVER_ERROR, (e as Error).message);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const customExpress = new CustomExpress(req, res, next);
  const authToken = req.authToken as string;
  const redisClient = await createRedis;
  const refeshToken = await redisClient.get(
    appConfig.redis.key.refeshToken(req.user?.id as string),
  );
  if (!refeshToken) {
    throw new AppError(
      ErrorMessages.BAD_REQUEST,
      ErrorMessages.REFESH_TOKEN_NOTFOUND,
      ErrorStatusCode.BAD_REQUEST,
    );
  }
  await Promise.all([
    // blacklist
    redisClient.set(appConfig.redis.key.authToken(authToken), "true", {
      expiration: {
        type: "EX",
        value: appConfig.redis.authExpiration,
      },
    }),
    // remove refeh token
    redisClient.del(refeshToken),
  ]);
  customExpress.response200({
    status: "successfull",
  });
};
