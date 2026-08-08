import { Currency, CurrencyEnum } from "../modules/transaction";

export type AppConfig = {
  port: string;
  databaseUrl: string;
  currencies: Record<CurrencyEnum, Currency>;

  jwt: JWTEnv;
  redis: RedisConfig;
};

export type JWTEnv = {
  auth: {
    secret: string;
    expiresIn: string;
    refeshExpires: string;
  };
};

export type RedisConfig = {
  host: string;
  port: string;
  username: string;
  password: string;
  expiration: number;
  authExpiration: number;
  key: {
    refeshToken: (id: string) => string;
    authToken: (id: string) => string;
  };
};
