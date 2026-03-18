import { Request, Response } from "express";
import { branchesService } from "../services/branches.service";
import { insertBranchSchema } from "@shared/schema";
import { respondZodError } from "../routes";

class BranchesController {
  getAll = async (req: Request | any, res: Response) => {
    const branches = await branchesService.getBranches(req.user.tenantId);
    res.json(branches);
  };

  getOne = async (req: Request | any, res: Response) => {
    const branch = await branchesService.getBranch(req.params.id, req.user.tenantId);
    if (!branch) {
      return res.status(404).json({ message: "Branch not found" });
    }
    res.json(branch);
  };

  create = async (req: Request | any, res: Response) => {
    try {
      const data = insertBranchSchema.parse(req.body);
      const branch = await branchesService.createBranch(req.user.tenantId, data);
      res.status(201).json(branch);
    } catch (error) {
      return respondZodError(res, error);
    }
  };

  update = async (req: Request | any, res: Response) => {
    try {
      const data = insertBranchSchema.partial().parse(req.body);
      const branch = await branchesService.updateBranch(req.params.id, req.user.tenantId, data);
      if (!branch) {
        return res.status(404).json({ message: "Branch not found" });
      }
      res.json(branch);
    } catch (error) {
      return respondZodError(res, error);
    }
  };

  delete = async (req: Request | any, res: Response) => {
    const success = await branchesService.deleteBranch(req.params.id, req.user.tenantId);
    if (!success) {
      return res.status(404).json({ message: "Branch not found" });
    }
    res.status(204).send();
  };
}

export const branchesController = new BranchesController();
