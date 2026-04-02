import { Request, Response } from "express";
import { ServiceTemplateModel, serviceTemplateValidationSchema } from "../models/serviceTemplate";
import { z } from "zod";

export class ServiceTemplateController {
    
    static async create(req: Request, res: Response) {
        try {
            const data = serviceTemplateValidationSchema.parse(req.body);
            const template = new ServiceTemplateModel(data);
            await template.save();
            
            res.status(201).json({
                message: "Plantilla de servicio creada exitosamente",
                data: template
            });
        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({ message: "Error de validación", errors: (error as any).errors });
            } else {
                res.status(500).json({ message: "Error interno", error });
            }
        }
    }

    static async getAll(req: Request, res: Response) {
        try {
            const templates = await ServiceTemplateModel.find().populate('rutaMaestra layoutBus');
            res.status(200).json({ data: templates });
        } catch (error) {
            res.status(500).json({ message: "Error interno", error });
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            const template = await ServiceTemplateModel.findOne({ numericId: Number(req.params.id) }).populate('routeMaster busLayout');
            if (!template) {
                return res.status(404).json({ message: "Plantilla no encontrada" });
            }
            res.status(200).json({ data: template });
        } catch (error) {
            res.status(500).json({ message: "Error interno", error });
        }
    }
}
