import jwt from "jsonwebtoken";
import { appConfig } from "../config/app.config";
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
}

export default JWTService;
