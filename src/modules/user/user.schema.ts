import { z } from "zod";
export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.union([z.string().email(), z.literal("")]),
  password: z.string(),
  phoneNumber: z.string(),
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
  email: true,
  account: true,
});

export const updateUserSchema = userSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  account: true,
});
