import { Router } from "express";
import { authenticateAccess } from "../auth";
import { employeesController } from "../controllers/employees.controller";

const router = Router();

router.get("/", authenticateAccess, employeesController.getAll);
router.post("/", authenticateAccess, employeesController.create);
router.get("/:id", authenticateAccess, employeesController.getOne);
router.put("/:id", authenticateAccess, employeesController.update);
router.delete("/:id", authenticateAccess, employeesController.delete);

export default router;
