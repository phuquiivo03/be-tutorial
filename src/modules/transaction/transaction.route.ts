import { Router } from "express";
import { transfer } from "./transaction.controller";
import { validate } from "../../shared/middlewares/validate";
import { transferSchema } from "./transaction.schema";
const router = Router();

router.post("/", validate(transferSchema), transfer);

export default router;
