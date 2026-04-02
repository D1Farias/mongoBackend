import { Router } from "express";
import { RouteMasterController } from "../controllers/routeMaster.controller";

const router = Router();

/**
 * @swagger
 * /api/ruta-maestra:
 *   post:
 *     summary: Crea una nueva Ruta Maestra
 *     tags: [Ruta Maestra]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RutaMaestra'
 *     responses:
 *       201:
 *         description: Ruta maestra creada exitosamente
 */
router.post("/", RouteMasterController.create);

/**
 * @swagger
 * /api/ruta-maestra:
 *   get:
 *     summary: Obtiene todas las rutas maestras
 *     tags: [Ruta Maestra]
 *     responses:
 *       200:
 *         description: Lista de rutas maestras
 */
router.get("/", RouteMasterController.getAll);

/**
 * @swagger
 * /api/ruta-maestra/{id}:
 *   get:
 *     summary: Obtiene una ruta maestra por su ID
 *     tags: [Ruta Maestra]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalles de la ruta maestra
 */
router.get("/:id", RouteMasterController.getById);

/**
 * @swagger
 * /api/ruta-maestra/{id}:
 *   put:
 *     summary: Actualiza una ruta maestra
 *     tags: [Ruta Maestra]
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
 *             $ref: '#/components/schemas/RutaMaestra'
 *     responses:
 *       200:
 *         description: Ruta maestra actualizada
 */
router.put("/:id", RouteMasterController.update);

/**
 * @swagger
 * /api/ruta-maestra/{id}:
 *   delete:
 *     summary: Elimina una ruta maestra
 *     tags: [Ruta Maestra]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Ruta maestra eliminada
 */
router.delete("/:id", RouteMasterController.delete);

export default router;
