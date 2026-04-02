import { Request, Response } from "express";
import { BusLayoutModel, busLayoutValidationSchema } from "../models/busLayout";
import { z } from "zod";

export class BusLayoutController {
    
    static async create(req: Request, res: Response) {
        try {
            const data = busLayoutValidationSchema.parse(req.body);
            const layout = new BusLayoutModel(data);
            await layout.save();
            
            res.status(201).json({
                message: "Layout de bus creado exitosamente",
                data: layout
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
            const layouts = await BusLayoutModel.find();
            res.status(200).json({ data: layouts });
        } catch (error) {
            res.status(500).json({ message: "Error interno", error });
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            const layout = await BusLayoutModel.findOne({ numericId: Number(req.params.id) });
            if (!layout) {
                return res.status(404).json({ message: "Layout no encontrado" });
            }
            res.status(200).json({ data: layout });
        } catch (error) {
            res.status(500).json({ message: "Error interno", error });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const data = busLayoutValidationSchema.parse(req.body);
            const layout = await BusLayoutModel.findOneAndUpdate(
                { numericId: Number(req.params.id) },
                data,
                { new: true, runValidators: true }
            );

            if (!layout) {
                return res.status(404).json({ message: "Layout no encontrado" });
            }

            res.status(200).json({
                message: "Layout actualizado",
                data: layout
            });
        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({ message: "Error de validación", errors: (error as any).errors });
            } else {
                res.status(500).json({ message: "Error interno", error });
            }
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const layout = await BusLayoutModel.findOneAndDelete({ numericId: Number(req.params.id) });
            if (!layout) {
                return res.status(404).json({ message: "Layout no encontrado" });
            }
            res.status(200).json({ message: "Layout eliminado" });
        } catch (error) {
            res.status(500).json({ message: "Error interno", error });
        }
    }
}
