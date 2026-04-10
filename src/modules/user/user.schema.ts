import { z } from "zod";
export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  password: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  account: z.object({
    currency: z.string(),
  }),
});

export const createUserSchema = userSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  account: true,
});

export const updateUserSchema = userSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  account: true,
});
