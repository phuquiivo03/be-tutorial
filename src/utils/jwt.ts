import jwt, { TokenExpiredError } from "jsonwebtoken";
import { appConfig } from "../config/app.config";
import { ZodSchema } from "zod/v3";
import { parseOrThrow } from "./zod.helper";
import Zod from "zod";
import { AppError, ErrorCodes, ErrorMessages } from "../shared/errors";
import { ErrorStatusCode } from "../shared/errors/errorCode";
class JWTService {
  static generateAuthToken(id: string): string {
    const secret = appConfig.jwt.auth.secret;
    // @ts-ignore
    return jwt.sign({ id }, secret, {
      expiresIn: appConfig.jwt.auth.expiresIn,
    });
  }

  static generateFefeshToken(id: string): string {
    const secret = appConfig.jwt.auth.secret;
    // @ts-ignore
    return jwt.sign({ id }, secret, {
      expiresIn: appConfig.jwt.auth.refeshExpires,
    });
  }

  static parseToken<T>(token: string, schema: Zod.ZodSchema<T>): T {
    try {
      const decoded = jwt.verify(token, appConfig.jwt.auth.secret);
      const parsedData = parseOrThrow<T>(schema, decoded);
      return parsedData;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new AppError(
          ErrorCodes.TOKEN_EXPIRED,
          ErrorMessages.AUTH_TOKEN_EXPIRED,
          ErrorStatusCode.BAD_REQUEST,
        );
      }
      throw new AppError(
        ErrorCodes.INTERNAL_SERVER_ERROR,
        ErrorMessages.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

export default JWTService;
