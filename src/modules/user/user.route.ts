import { Router } from "express";
import { createUser, findAll, getUser, updateUser } from "./user.controller";
import { createUserSchema } from "./user.schema";
import { validate } from "../../shared/middlewares";

const router = Router();

router.post("/", validate(createUserSchema), createUser);
router.get("/", findAll);
router.get("/:id", getUser);
router.patch("/:id", updateUser);

export default router;
