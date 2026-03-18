import { Request, Response } from "express";
import { employeesService } from "../services/employees.service";
import { insertEmployeeSchema } from "@shared/schema";
import { respondZodError } from "../routes";

class EmployeesController {
  getAll = async (req: Request | any, res: Response) => {
    const employees = await employeesService.getEmployees(req.user.tenantId);
    res.json(employees);
  };

  getOne = async (req: Request | any, res: Response) => {
    const employee = await employeesService.getEmployee(req.params.id, req.user.tenantId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.json(employee);
  };

  create = async (req: Request | any, res: Response) => {
    try {
      const data = insertEmployeeSchema.parse(req.body);
      const employee = await employeesService.createEmployee(req.user.tenantId, data);
      res.status(201).json(employee);
    } catch (error) {
      return respondZodError(res, error);
    }
  };

  update = async (req: Request | any, res: Response) => {
    try {
      const data = insertEmployeeSchema.partial().parse(req.body);
      const employee = await employeesService.updateEmployee(req.params.id, req.user.tenantId, data);
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      res.json(employee);
    } catch (error) {
      return respondZodError(res, error);
    }
  };

  delete = async (req: Request | any, res: Response) => {
    const success = await employeesService.deleteEmployee(req.params.id, req.user.tenantId);
    if (!success) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(204).send();
  };
}

export const employeesController = new EmployeesController();
