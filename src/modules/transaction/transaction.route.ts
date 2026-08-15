import { Router } from "express";
import { getHistoryByUser, transfer } from "./transaction.controller";
import { validate } from "../../shared/middlewares/validate";
import { transferSchema } from "./transaction.schema";
import { asyncHandler } from "../../shared/middlewares/errorHandler";
import { authMiddleware } from "../../shared/middlewares/auth";
const router = Router();

router.post("/", validate(transferSchema), asyncHandler(transfer));
router.get("/users", authMiddleware, asyncHandler(getHistoryByUser));
export default router;
