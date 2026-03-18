import { Request, Response } from "express";
import { appointmentsService } from "../services/appointments.service";
import { insertAppointmentSchema } from "@shared/schema";
import { respondZodError } from "../routes";

class AppointmentsController {
  getAll = async (req: Request | any, res: Response) => {
    const appointments = await appointmentsService.getAppointments(req.user.tenantId);
    res.json(appointments);
  };

  getOne = async (req: Request | any, res: Response) => {
    const appointment = await appointmentsService.getAppointment(req.params.id, req.user.tenantId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.json(appointment);
  };

  create = async (req: Request | any, res: Response) => {
    try {
      const data = insertAppointmentSchema.parse(req.body);
      const appointment = await appointmentsService.createAppointment(req.user.tenantId, data);
      res.status(201).json(appointment);
    } catch (error) {
      return respondZodError(res, error);
    }
  };

  update = async (req: Request | any, res: Response) => {
    try {
      const data = insertAppointmentSchema.partial().parse(req.body);
      const appointment = await appointmentsService.updateAppointment(req.params.id, req.user.tenantId, data);
      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }
      res.json(appointment);
    } catch (error) {
      return respondZodError(res, error);
    }
  };

  delete = async (req: Request | any, res: Response) => {
    const success = await appointmentsService.deleteAppointment(req.params.id, req.user.tenantId);
    if (!success) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(204).send();
  };
}

export const appointmentsController = new AppointmentsController();
