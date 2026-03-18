import { Router } from "express";
import { authenticateAccess } from "../auth";
import { servicesController } from "../controllers/services.controller";

const router = Router();

router.get("/", authenticateAccess, servicesController.getAll);
router.post("/", authenticateAccess, servicesController.create);
router.get("/:id", authenticateAccess, servicesController.getOne);
router.put("/:id", authenticateAccess, servicesController.update);
router.delete("/:id", authenticateAccess, servicesController.delete);

export default router;
