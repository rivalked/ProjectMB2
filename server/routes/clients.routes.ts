import { Router } from "express";
import { authenticateAccess } from "../auth";
import { clientsController } from "../controllers/clients.controller";

const router = Router();

router.get("/export", authenticateAccess, clientsController.exportExcel);
router.get("/", authenticateAccess, clientsController.getAll);
router.post("/", authenticateAccess, clientsController.create);
router.get("/:id", authenticateAccess, clientsController.getOne);
router.put("/:id", authenticateAccess, clientsController.update);
router.delete("/:id", authenticateAccess, clientsController.delete);

export default router;
