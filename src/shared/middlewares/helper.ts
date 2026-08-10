import JWTService from "../../utils/jwt";
import { IAuthenJWT, AuthJWTSchema } from "../types/auth";
import { AppError, ErrorCodes, ErrorMessages } from "../errors";
import { ErrorStatusCode } from "../errors/errorCode";
import userService from "../../modules/user/user.service";
import createRedis from "../../infrastructure/redis/connect";
import { RequestUser } from "../../modules/user/user.type";
import { appConfig } from "../../config";

export const verifyAndGetAuthUser = async (
  authToken: string,
): Promise<RequestUser> => {
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
  return reqUser;
};
