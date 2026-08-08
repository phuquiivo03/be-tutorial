import z from "zod";

export type AppResponse<T> = {
  status: boolean;
  message: string;
  data: T;
};

export const AuthJWTSchema = z.object({
  id: z.string(),
});

export type IAuthenJWT = z.infer<typeof AuthJWTSchema>;
