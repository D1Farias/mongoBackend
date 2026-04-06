import { Router } from "express";
import { GeneratedServiceController } from "../controllers/generatedService.controller";

const router = Router();

/**
 * @swagger
 * /api/servicios:
 *   get:
 *     summary: Obtiene todos los servicios generados en la base de datos (Sin generar nuevos)
 *     tags: [Servicios]
 *     responses:
 *       200:
 *         description: Lista de todos los servicios físicos almacenados
 */
router.get("/", GeneratedServiceController.getAll);

/**
 * @swagger
 * /api/servicios/buscar:
 *   post:
 *     summary: Obtiene (y genera si no existe) los servicios disponibles para una fecha y tramo
 *     tags: [Servicios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - origen
 *               - destino
 *               - fecha
 *             properties:
 *               origen:
 *                 type: string
 *                 example: "Santiago"
 *               destino:
 *                 type: string
 *                 example: "Talca"
 *               fecha:
 *                 type: string
 *                 example: "2024-05-10"
 *                 description: Formato YYYY-MM-DD
 *     responses:
 *       200:
 *         description: Lista de servicios con el tramo consultado
 */
router.post("/buscar", GeneratedServiceController.getServices);


/**
 * @swagger
 * /api/servicios/{id}:
 *   delete:
 *     summary: Elimina un servicio generado específicamente
 *     tags: [Servicios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Servicio eliminado
 */
router.delete("/:id", GeneratedServiceController.delete);

export default router;
