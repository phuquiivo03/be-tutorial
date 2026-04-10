import { z } from "zod";
import { accountSchema } from "./account.schema";

export type Account = z.infer<typeof accountSchema>;
