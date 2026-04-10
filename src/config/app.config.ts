import { currencies } from "../modules/transaction";
import { env } from "./env";

export const appConfig = {
  port: env.port,
  currencies: currencies,
};
