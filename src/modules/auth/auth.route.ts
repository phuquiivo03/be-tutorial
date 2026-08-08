import { Request, Response, Router } from "express";
import { loginSchema } from "./auth.schema";
import { login, logout } from "./auth.controller";
import { validate } from "../../shared/middlewares/validate";
import { asyncHandler } from "../../shared/middlewares/errorHandler";
import { authMiddleware } from "../../shared/middlewares/auth";
const router = Router();

router.post("/login", validate(loginSchema), asyncHandler(login));
router.post("/logout", authMiddleware, asyncHandler(logout));
export default router;
