import { NextFunction, Request, Response } from "express";
import userService from "../user/user.service";
import { hash, compare } from "../../utils/hashing";
import { LoginData } from "./auth.type";
import { AppError, ErrorCodes, ErrorMessages } from "../../shared/errors";
import JWTService from "../../utils/jwt";
import createRedis from "../../infrastructure/redis/connect";
import { appConfig } from "../../config/app.config";
export const login = async (req: Request, res: Response) => {
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
    user;
    const { password, ...responseData } = user;
    res.status(200).json({
      ...responseData,
      authenToken,
      refeshToken,
    });
    // response
  } catch (e) {
    throw new AppError(ErrorCodes.INTERNAL_SERVER_ERROR, (e as Error).message);
  }
};
