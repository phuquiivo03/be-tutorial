import { z } from "zod";
import { Prisma } from "@prisma/client";
import { ErrorMessages } from "../../shared/errors/errorMessage";

export const loginSchema = z.object({
  phoneNumber: z.string(),
  password: z.string(),
});
