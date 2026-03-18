import { Request, Response } from "express";
import { financeService } from "../services/finance.service";

class FinanceController {
  getProfitAndLoss = async (req: Request | any, res: Response) => {
    try {
      const tenantId = req.user?.tenantId;
      if (!tenantId) {
        return res.status(400).json({ message: "Tenant ID required" });
      }

      const pAndLReport = await financeService.calculateProfitAndLoss(tenantId);
      return res.json(pAndLReport);
    } catch (error: any) {
      console.error("[FinanceController] Error in getProfitAndLoss:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
}

export const financeController = new FinanceController();
