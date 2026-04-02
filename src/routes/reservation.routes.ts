import { Router } from "express";
import { ReservationController } from "../controllers/reservation.controller";

const router = Router();

/**
 * @swagger
 * /api/reservas/reservar:
 *   post:
 *     summary: Bloquea un asiento temporalmente por 10 minutos
 *     tags: [Reservas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reserva'
 *     responses:
 *       201:
 *         description: Asiento reservado
 *       400:
 *         description: Origen/destino inválidos
 *       409:
 *         description: Asiento no disponible por solapamiento de tramo
 */
router.post("/reservar", ReservationController.reserve);

/**
 * @swagger
 * /api/reservas/confirmar:
 *   post:
 *     summary: Confirma (paga) una reserva previamente bloqueada
 *     tags: [Reservas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reservaId:
 *                 type: integer
 *               pasajero:
 *                 type: string
 *               documento:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reserva confirmada exitosamente
 */
router.post("/confirmar", ReservationController.confirm);

/**
 * @swagger
 * /api/reservas/cancelar:
 *   post:
 *     summary: Cancela manualmente una reserva
 *     tags: [Reservas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reservaId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Reserva cancelada
 */
router.post("/cancelar", ReservationController.cancel);

export default router;
