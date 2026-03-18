import { Request, Response } from "express";
import { servicesService } from "../services/services.service";
import { insertServiceSchema } from "@shared/schema";
import { respondZodError } from "../routes";

class ServicesController {
  getAll = async (req: Request | any, res: Response) => {
    const services = await servicesService.getServices(req.user.tenantId);
    res.json(services);
  };

  getOne = async (req: Request | any, res: Response) => {
    const service = await servicesService.getService(req.params.id, req.user.tenantId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.json(service);
  };

  create = async (req: Request | any, res: Response) => {
    try {
      const data = insertServiceSchema.parse(req.body);
      const service = await servicesService.createService(req.user.tenantId, data);
      res.status(201).json(service);
    } catch (error) {
      return respondZodError(res, error);
    }
  };

  update = async (req: Request | any, res: Response) => {
    try {
      const data = insertServiceSchema.partial().parse(req.body);
      const service = await servicesService.updateService(req.params.id, req.user.tenantId, data);
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }
      res.json(service);
    } catch (error) {
      return respondZodError(res, error);
    }
  };

  delete = async (req: Request | any, res: Response) => {
    const success = await servicesService.deleteService(req.params.id, req.user.tenantId);
    if (!success) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.status(204).send();
  };
}

export const servicesController = new ServicesController();
