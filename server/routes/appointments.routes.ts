import { Router } from "express";
import { authenticateAccess } from "../auth";
import { appointmentsController } from "../controllers/appointments.controller";

const router = Router();

router.get("/", authenticateAccess, appointmentsController.getAll);
router.post("/", authenticateAccess, appointmentsController.create);
router.get("/:id", authenticateAccess, appointmentsController.getOne);
router.put("/:id", authenticateAccess, appointmentsController.update);
router.delete("/:id", authenticateAccess, appointmentsController.delete);

export default router;
