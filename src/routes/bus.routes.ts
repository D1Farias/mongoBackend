import { Router } from "express";
import { BusController } from "../controllers/bus.controller";

const router = Router();

/**
 * @swagger
 * /api/buses:
 *   post:
 *     summary: Crea un nuevo bus
 *     tags: [Buses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Bus'
 *     responses:
 *       201:
 *         description: Bus creado con éxito
 *       400:
 *         description: Datos inválidos
 */
router.post("/", BusController.create);

/**
 * @swagger
 * /api/buses:
 *   get:
 *     summary: Obtiene todos los buses
 *     tags: [Buses]
 *     responses:
 *       200:
 *         description: Lista de buses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Bus'
 */
router.get("/", BusController.getAll);

/**
 * @swagger
 * /api/buses/{id}:
 *   get:
 *     summary: Obtiene un bus por ID
 *     tags: [Buses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Datos del bus
 *       404:
 *         description: Bus no encontrado
 */
router.get("/:id", BusController.getById);

/**
 * @swagger
 * /api/buses/{id}:
 *   delete:
 *     summary: Elimina un bus por ID
 *     tags: [Buses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Bus eliminado
 *       404:
 *         description: Bus no encontrado
 */
router.delete("/:id", BusController.delete);

export default router;

