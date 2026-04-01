import { Router } from "express";
import { TicketController } from "../controllers/ticket.controller";

const router = Router();

/**
 * @swagger
 * /api/tickets:
 *   get:
 *     summary: Obtiene todos los tickets registrados
 *     tags: [Tickets]
 *     responses:
 *       200:
 *         description: Lista de todos los tickets
 */
router.get("/", TicketController.getAll);

/**
 * @swagger
 * /api/tickets/{id}:
 *   get:
 *     summary: Obtiene un ticket por ID numérico
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Datos del ticket
 *       404:
 *         description: Ticket no encontrado
 */
router.get("/:id", TicketController.getById);

/**
 * @swagger
 * /api/tickets/viaje/{tripId}:
 *   get:
 *     summary: Obtiene los tickets de un viaje específico
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Lista de tickets del viaje
 */
router.get("/viaje/:tripId", TicketController.getByTripId);

export default router;
