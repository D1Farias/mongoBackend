import { Request, Response } from "express";
import { TicketService } from "../services/ticket.services";

const ticketService = new TicketService();

export class TicketController {
    static async getAll(_req: Request, res: Response) {
        try {
            const tickets = await ticketService.getAll();
            res.status(200).json({
                message: "Listado completo de tickets emitidos",
                data: tickets
            });
        } catch (error: any) {
            res.status(500).json({
                message: "Error al recuperar el historial de tickets",
                error: error.message
            });
        }
    }

    static async getByTripId(req: Request, res: Response) {
        try {
            const tripId = Number(req.params.tripId);
            const tickets = await ticketService.getByTripId(tripId);
            res.status(200).json({
                message: `Tickets encontrados para el viaje #${tripId}`,
                data: tickets
            });
        } catch (error: any) {
            res.status(500).json({
                message: "Error al filtrar tickets por viaje",
                error: error.message
            });
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const ticket = await ticketService.getById(id);
            if (!ticket) {
                return res.status(404).json({
                    message: `No se encontró el ticket con ID ${id}`
                });
            }
            res.status(200).json({
                message: "Detalles del ticket recuperados",
                data: ticket
            });
        } catch (error: any) {
            res.status(500).json({
                message: "Error al consultar los detalles del ticket",
                error: error.message
            });
        }
    }
}

