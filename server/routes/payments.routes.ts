import { Router } from "express";
import { authenticateAccess } from "../auth";
import { paymentsController } from "../controllers/payments.controller";

const router = Router();

router.get("/", authenticateAccess, paymentsController.getAll);
router.post("/", authenticateAccess, paymentsController.create);

export default router;
