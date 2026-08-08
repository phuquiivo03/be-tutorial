import { createUserSchema, updateUserSchema, userSchema } from "./user.schema";
import { z } from "zod";

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type User = z.infer<typeof userSchema>;
export type RequestUser = Omit<User, "password" | "account">;
