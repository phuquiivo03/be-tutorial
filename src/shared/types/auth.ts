import z from "zod";


export const AuthJWTSchema = z.object({
  id: z.string(),
});

export type IAuthenJWT = z.infer<typeof AuthJWTSchema>;
