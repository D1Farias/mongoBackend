import { Request, Response } from "express";
import { BusService } from "../services/bus.services";
import { busValidationSchema } from "../models/bus";

const busService = new BusService();

export class BusController {
    static async create(req: Request, res: Response) {
        try {
            const validatedData = busValidationSchema.parse(req.body);
            const bus = await busService.create(validatedData as any);
            res.status(201).json({
                message: "Bus registrado exitosamente en el sistema",
                data: bus
            });
        } catch (error: any) {
            res.status(400).json({ 
                message: "Error al registrar el bus. Verifique los datos enviados.",
                error: error.errors || error.message 
            });
        }
    }

    static async getAll(_req: Request, res: Response) {
        try {
            const buses = await busService.getAll();
            res.status(200).json({
                message: "Listado de buses recuperado satisfactoriamente",
                data: buses
            });
        } catch (error: any) {
            res.status(500).json({ 
                message: "Ocurrió un error al obtener la lista de buses",
                error: error.message 
            });
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const bus = await busService.getById(id);
            if (!bus) {
                return res.status(404).json({ 
                    message: `No se encontró ningún bus con el ID ${id}` 
                });
            }
            res.status(200).json({
                message: "Datos del bus encontrados",
                data: bus
            });
        } catch (error: any) {
            res.status(500).json({ 
                message: "Error al consultar el bus especificado",
                error: error.message 
            });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const bus = await busService.delete(id);
            if (!bus) {
                return res.status(404).json({ 
                    message: `Intento de eliminación fallido: El bus con ID ${id} no existe` 
                });
            }
            res.status(200).json({ 
                message: "El bus ha sido eliminado permanentemente del sistema",
                data: { id }
            });
        } catch (error: any) {
            res.status(500).json({ 
                message: "Error técnico durante la eliminación del bus",
                error: error.message 
            });
        }
    }
}

