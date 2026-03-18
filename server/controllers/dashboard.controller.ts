import { Request, Response } from "express";
import { dashboardService } from "../services/dashboard.service";

class DashboardController {
  getStats = async (req: Request | any, res: Response) => {
    try {
      const stats = await dashboardService.getStats(req.user.tenantId);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to load dashboard stats" });
    }
  };
}

export const dashboardController = new DashboardController();
