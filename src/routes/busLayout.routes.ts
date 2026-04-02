import { Router } from "express";
import { BusLayoutController } from "../controllers/busLayout.controller";

const router = Router();

/**
 * @swagger
 * /api/layout-bus:
 *   post:
 *     summary: Crea un nuevo layout de bus
 *     tags: [Layout Bus]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LayoutBus'
 *     responses:
 *       201:
 *         description: Layout creado exitosamente
 */
router.post("/", BusLayoutController.create);

/**
 * @swagger
 * /api/layout-bus:
 *   get:
 *     summary: Obtiene todos los layouts de bus
 *     tags: [Layout Bus]
 *     responses:
 *       200:
 *         description: Lista de layouts
 */
router.get("/", BusLayoutController.getAll);

/**
 * @swagger
 * /api/layout-bus/{id}:
 *   get:
 *     summary: Obtiene un layout de bus por ID
 *     tags: [Layout Bus]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalles del layout
 */
router.get("/:id", BusLayoutController.getById);

/**
 * @swagger
 * /api/layout-bus/{id}:
 *   put:
 *     summary: Actualiza un layout de bus
 *     tags: [Layout Bus]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LayoutBus'
 *     responses:
 *       200:
 *         description: Layout actualizado
 */
router.put("/:id", BusLayoutController.update);

/**
 * @swagger
 * /api/layout-bus/{id}:
 *   delete:
 *     summary: Elimina un layout de bus
 *     tags: [Layout Bus]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Layout eliminado exitosamente
 */
router.delete("/:id", BusLayoutController.delete);

export default router;
