import z from "zod";
import { loginSchema } from "./auth.schema";

export type LoginData = z.infer<typeof loginSchema>;
