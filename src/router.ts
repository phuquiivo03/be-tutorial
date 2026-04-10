import { Router } from "express";
import userRoutes from "./modules/user/user.route";
import transactionRoutes from "./modules/transaction/transaction.route";
import accountRoutes from "./modules/account/account.route";
const router = Router();
router.use("/users", userRoutes);
router.use("/transactions", transactionRoutes);
router.use("/accounts", accountRoutes);
export default router;
