import { z } from "zod";
import { CurrencyEnum } from "../transaction";
export const accountSchema = z.object({
  id: z.string(),
  currency: z.enum(Object.values(CurrencyEnum)),
  userId: z.string(),
});
