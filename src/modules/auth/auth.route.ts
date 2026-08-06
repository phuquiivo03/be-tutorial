import { Request, Response, Router } from "express";
import { loginSchema } from "./auth.schema";
import { login } from "./auth.controller";
import { validate } from "../../shared/middlewares/validate";
const router = Router();

router.post("/", validate(loginSchema), login);

export default router;
