import { Router } from "express";
import { ViajeController } from "../controllers/viaje.controller";

const router = Router();

/**
 * @swagger
 * /api/viajes:
 *   post:
 *     summary: Crea un nuevo viaje
 *     tags: [Viajes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Viaje'
 *     responses:
 *       201:
 *         description: Viaje creado
 *       400:
 *         description: Error en los datos
 */
router.post("/", ViajeController.create);

/**
 * @swagger
 * /api/viajes:
 *   get:
 *     summary: Obtiene todos los viajes
 *     tags: [Viajes]
 *     responses:
 *       200:
 *         description: Lista de viajes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Viaje'
 */
router.get("/", ViajeController.getAll);

/**
 * @swagger
 * /api/viajes/{id}:
 *   get:
 *     summary: Obtiene un viaje por ID
 *     tags: [Viajes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Datos del viaje
 *       404:
 *         description: Viaje no encontrado
 */
router.get("/:id", ViajeController.getById);

/**
 * @swagger
 * /api/viajes/{id}:
 *   put:
 *     summary: Actualiza un viaje por ID
 *     tags: [Viajes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Viaje'
 *     responses:
 *       200:
 *         description: Viaje actualizado
 */
router.put("/:id", ViajeController.update);

/**
 * @swagger
 * /api/viajes/{id}:
 *   delete:
 *     summary: Elimina un viaje por ID
 *     tags: [Viajes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Viaje eliminado
 */
router.delete("/:id", ViajeController.delete);

/**
 * @swagger
 * /api/viajes/{id}/reserva:
 *   post:
 *     summary: Reserva un asiento en un viaje y genera un Ticket
 *     tags: [Viajes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     request_body:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               asiento:
 *                 type: string
 *                 example: "A1"
 *               pasajero:
 *                 type: string
 *                 example: "Juan Pérez"
 *     responses:
 *       200:
 *         description: Asiento reservado y Ticket generado
 *       400:
 *         description: Error en la reserva (ej. asiento ocupado o capacidad agotada)
 */
router.post("/:id/reserva", ViajeController.reserve);


export default router;


