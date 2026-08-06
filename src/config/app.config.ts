import "dotenv/config";
import { JWTEnv, type AppConfig, type RedisConfig } from "./type";
import { currencies } from "../modules/transaction";

const redis: RedisConfig = {
  username: process.env.REDIS_USERNAME || "",
  password: process.env.REDIS_PASSWORD || "",
  host: process.env.REDIS_HOST || "",
  port: process.env.REDIS_PORT || "",
  expiration: (parseInt(process.env.REDIS_REFESH_TOKEN_EXPIRATION || "1") || 1) * 24 * 3600,
  key: {
    refeshToken: (id) => `refesh_auth_token_${id}`,
  },
};

const jwt: JWTEnv = {
  auth: {
    secret: process.env.JWT_SECRET || "",
    expiresIn: process.env.JWT_EXPIRE || "24h",
    refeshExpires: process.env.JWT_REFESG_EXPIRE || "30d",
  },
};

export const appConfig: AppConfig = {
  port: process.env.PORT || "3000",
  databaseUrl: process.env.DATABASE_URL || "",
  currencies: currencies,
  jwt,
  redis,
};
