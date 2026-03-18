import { Router } from "express";
import { authenticateAccess } from "../auth";
import { storage } from "../storage";
import { insertTenantSchema } from "@shared/schema";
import { respondZodError } from "../routes";

const router = Router();

const requireSuperAdmin = (req: any, res: any, next: any) => {
  if (!req.user || req.user.role !== "super_admin") {
    return res.status(403).json({ message: "Forbidden: Super Admin access required" });
  }
  next();
};

router.get("/tenants", authenticateAccess, requireSuperAdmin, async (req: any, res) => {
  res.json(await (storage as any).getTenants());
});
router.patch("/tenants/:id", authenticateAccess, requireSuperAdmin, async (req: any, res) => {
  try {
    const data = insertTenantSchema.partial().parse(req.body);
    const tenant = await (storage as any).updateTenant(req.params.id, data);
    if (!tenant) return res.status(404).json({ message: "Tenant not found" });
    res.json(tenant);
  } catch (error) { return respondZodError(res, error); }
});
router.get("/subscriptions", authenticateAccess, requireSuperAdmin, async (req: any, res) => {
  res.json(await (storage as any).getSubscriptions());
});
router.get("/addons", authenticateAccess, requireSuperAdmin, async (req: any, res) => {
  res.json(await (storage as any).getAddons());
});
router.get("/tenants/:id/addons", authenticateAccess, requireSuperAdmin, async (req: any, res) => {
  res.json(await (storage as any).getTenantAddons(req.params.id));
});
router.patch("/tenants/:id/addons", authenticateAccess, requireSuperAdmin, async (req: any, res) => {
  const { addonId, active } = req.body;
  if (!addonId || active === undefined) return res.status(400).json({ message: "addonId and active required" });
  res.json(await (storage as any).updateTenantAddon(req.params.id, addonId, active));
});

export default router;
