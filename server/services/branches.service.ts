import { storage } from "../storage";
import { InsertBranch } from "@shared/schema";

class BranchesService {
  async getBranches(tenantId: string) { return storage.getBranches(tenantId); }
  async getBranch(id: string, tenantId: string) { return storage.getBranch(id, tenantId); }
  async createBranch(tenantId: string, data: InsertBranch) { return storage.createBranch(tenantId, data); }
  async updateBranch(id: string, tenantId: string, data: Partial<InsertBranch>) { return storage.updateBranch(id, tenantId, data); }
  async deleteBranch(id: string, tenantId: string) { return storage.deleteBranch(id, tenantId); }
}

export const branchesService = new BranchesService();
