import { Request, Response } from "express";
import { TripService } from "../services/trip.services";
import { tripValidationSchema } from "../models/trip";

const tripService = new TripService();

export class ViajeController {
    static async create(req: Request, res: Response) {
        try {
            const validatedData = tripValidationSchema.parse(req.body);
            const trip = await tripService.create(validatedData as any);
            res.status(201).json({
                message: "Nuevo viaje programado exitosamente",
                data: trip
            });
        } catch (error: any) {
            res.status(400).json({ 
                message: "No se pudo programar el viaje. Verifique los datos de origen, destino y bus.",
                error: error.errors || error.message 
            });
        }
    }

    static async getAll(_req: Request, res: Response) {
        try {
            const trips = await tripService.getAll();
            res.status(200).json({
                message: "Listado de viajes recuperado",
                data: trips
            });
        } catch (error: any) {
            res.status(500).json({ 
                message: "Error al obtener la lista de viajes registrados",
                error: error.message 
            });
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const trip = await tripService.getById(id);
            if (!trip) {
                return res.status(404).json({ 
                    message: `No existe un viaje con el ID ${id}` 
                });
            }
            res.status(200).json({
                message: "Información detallada del viaje encontrada",
                data: trip
            });
        } catch (error: any) {
            res.status(500).json({ 
                message: "Error al consultar el viaje",
                error: error.message 
            });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const validatedData = tripValidationSchema.partial().parse(req.body);
            const trip = await tripService.update(id, validatedData as any);
            if (!trip) {
                return res.status(404).json({ 
                    message: `No se pudo actualizar: El viaje con ID ${id} no existe` 
                });
            }
            res.status(200).json({
                message: "Información del viaje actualizada correctamente",
                data: trip
            });
        } catch (error: any) {
            res.status(400).json({ 
                message: "Error al intentar actualizar los datos del viaje",
                error: error.errors || error.message 
            });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const trip = await tripService.delete(id);
            if (!trip) {
                return res.status(404).json({ 
                    message: `Eliminación cancelada: El viaje con ID ${id} no existe` 
                });
            }
            res.status(200).json({ 
                message: "El viaje ha sido eliminado del sistema",
                data: { id }
            });
        } catch (error: any) {
            res.status(500).json({ 
                message: "Error técnico al eliminar el viaje",
                error: error.message 
            });
        }
    }

    static async reserve(req: Request, res: Response) {
        try {
            const { asiento, pasajero } = req.body;
            if (!asiento) return res.status(400).json({ message: "El número de asiento es obligatorio para la reserva" });
            if (!pasajero) return res.status(400).json({ message: "Debe proporcionar el nombre del pasajero" });

            const result = await tripService.reserveSeat(Number(req.params.id), asiento, pasajero);
            res.status(200).json({ 
                message: `Asiento ${asiento} reservado con éxito para ${pasajero}`,
                data: {
                    viaje: result.trip,
                    boleto: result.ticket
                }
            });
        } catch (error: any) {
            res.status(400).json({ 
                message: "La reserva no pudo ser procesada",
                error: error.message 
            });
        }
    }
}


