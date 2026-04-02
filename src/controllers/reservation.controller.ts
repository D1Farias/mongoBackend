import { Request, Response } from "express";
import { ReservationModel, reservationValidationSchema, confirmationValidationSchema } from "../models/reservation";
import { GeneratedServiceModel } from "../models/generatedService";
import { z } from "zod";

export class ReservationController {

    static async reserve(req: Request, res: Response) {
        try {
            const data = reservationValidationSchema.parse(req.body);
            
            const service = await GeneratedServiceModel.findOne({ numericId: data.servicioId });
            if (!service) {
                return res.status(404).json({ message: "Servicio no encontrado" });
            }

            const originCity = service.ciudades.find(c => c.nombre === data.origen);
            const destCity = service.ciudades.find(c => c.nombre === data.destino);

            if (!originCity || !destCity) {
                return res.status(400).json({ message: "Origen o destino inválidos para este servicio" });
            }

            const originIndex = service.ciudades.findIndex(c => c.nombre === data.origen);
            const destIndex = service.ciudades.findIndex(c => c.nombre === data.destino);

            if (originIndex >= destIndex) {
                return res.status(400).json({ message: "El origen debe ser anterior al destino" });
            }

            // Verificar solapamiento
            const existingReservations = await ReservationModel.find({
                servicioId: data.servicioId,
                numeroAsiento: data.numeroAsiento,
                estado: { $in: ['reservado', 'confirmado'] }
            });

            for (const r of existingReservations) {
                // Existe solapamiento si max(A_start, B_start) < min(A_end, B_end)
                const startOverlap = Math.max(originIndex, r.indiceOrigen);
                const endOverlap = Math.min(destIndex, r.indiceDestino);

                if (startOverlap < endOverlap) {
                    return res.status(409).json({ message: `Asiento ${data.numeroAsiento} no está disponible en este tramo` });
                }
            }

            // Crear reserva temporal
            const newRes = new ReservationModel({
                servicioId: data.servicioId,
                numeroAsiento: data.numeroAsiento,
                origen: data.origen,
                destino: data.destino,
                indiceOrigen: originIndex,
                indiceDestino: destIndex,
                estado: 'reservado'
            });

            await newRes.save();

            res.status(201).json({
                message: "Asiento bloqueado temporalmente por 10 minutos",
                data: newRes
            });

        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({ message: "Error de validación", errors: (error as any).errors });
            } else {
                res.status(500).json({ message: "Error interno", error });
            }
        }
    }

    static async confirm(req: Request, res: Response) {
        try {
            const data = confirmationValidationSchema.parse(req.body);
            
            const reservation = await ReservationModel.findOne({ numericId: data.reservaId });

            if (!reservation) {
                return res.status(404).json({ message: "Reserva no encontrada" });
            }

            if (reservation.estado !== 'reservado') {
                return res.status(400).json({ message: `No se puede confirmar. Estado actual: ${reservation.estado}` });
            }

            if (reservation.fechaExpiracion.getTime() < Date.now()) {
                reservation.estado = 'cancelado';
                await reservation.save();
                return res.status(400).json({ message: "El tiempo de reserva ha expirado. El asiento fue liberado." });
            }

            reservation.estado = 'confirmado';
            reservation.pasajero = data.pasajero;
            reservation.documento = data.documento;
            
            await reservation.save();

            res.status(200).json({
                message: "Reserva confirmada exitosamente",
                data: reservation
            });

        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({ message: "Error de validación", errors: (error as any).errors });
            } else {
                res.status(500).json({ message: "Error interno", error });
            }
        }
    }

    static async cancel(req: Request, res: Response) {
        try {
            const id = req.body.reservaId;
            if (!id) return res.status(400).json({ message: "Se requiere reservaId" });

            const reservation = await ReservationModel.findOne({ numericId: id });
            
            if (!reservation) return res.status(404).json({ message: "Reserva no encontrada" });

            reservation.estado = 'cancelado';
            await reservation.save();

            res.status(200).json({
                message: "Reserva cancelada exitosamente"
            });
        } catch (error) {
            res.status(500).json({ message: "Error interno", error });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const reservation = await ReservationModel.findOneAndDelete({ numericId: Number(req.params.id) });
            if (!reservation) {
                return res.status(404).json({ message: "Reserva no encontrada" });
            }
            res.status(200).json({ message: "Reserva eliminada físicamente de la base de datos" });
        } catch (error) {
            res.status(500).json({ message: "Error interno", error });
        }
    }
}
