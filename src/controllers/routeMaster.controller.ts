import { Request, Response } from "express";
import { RouteMasterModel, routeMasterValidationSchema } from "../models/routeMaster";
import { z } from "zod";

export class RouteMasterController {
    
    // Crear nueva ruta maestra
    static async create(req: Request, res: Response) {
        try {
            const data = routeMasterValidationSchema.parse(req.body);
            
            const newRoute = new RouteMasterModel(data);
            await newRoute.save();
            
            res.status(201).json({
                message: "Ruta maestra obligatoria creada exitosamente",
                data: newRoute
            });
        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({ message: "Error de validación", errors: (error as any).errors });
            } else {
                res.status(500).json({ message: "Error interno del servidor", error });
            }
        }
    }

    // Obtener todas las rutas maestras
    static async getAll(req: Request, res: Response) {
        try {
            const routes = await RouteMasterModel.find();
            res.status(200).json({ data: routes });
        } catch (error) {
            res.status(500).json({ message: "Error interno del servidor", error });
        }
    }

    // Obtener por ID
    static async getById(req: Request, res: Response) {
        try {
            const route = await RouteMasterModel.findOne({ numericId: Number(req.params.id) });
            if (!route) {
                return res.status(404).json({ message: "Ruta maestra no encontrada" });
            }
            res.status(200).json({ data: route });
        } catch (error) {
            res.status(500).json({ message: "Error interno del servidor", error });
        }
    }

    // Actualizar
    static async update(req: Request, res: Response) {
        try {
            const data = routeMasterValidationSchema.parse(req.body);
            
            const route = await RouteMasterModel.findOne({ numericId: Number(req.params.id) });
            if (!route) {
                return res.status(404).json({ message: "Ruta maestra no encontrada" });
            }

            route.nombre = data.nombre;
            route.ciudades = data.ciudades;
            await route.save(); // trigger pre-save para regenerar tramos

            res.status(200).json({
                message: "Ruta maestra actualizada",
                data: route
            });
        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({ message: "Error de validación", errors: (error as any).errors });
            } else {
                res.status(500).json({ message: "Error interno del servidor", error });
            }
        }
    }

    // Eliminar
    static async delete(req: Request, res: Response) {
        try {
            const route = await RouteMasterModel.findOneAndDelete({ numericId: Number(req.params.id) });
            if (!route) {
                return res.status(404).json({ message: "Ruta maestra no encontrada" });
            }
            res.status(200).json({ message: "Ruta maestra eliminada exitosamente" });
        } catch (error) {
            res.status(500).json({ message: "Error interno del servidor", error });
        }
    }
}
