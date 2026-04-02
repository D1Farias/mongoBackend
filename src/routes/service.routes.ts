import { Router } from "express";
import { GeneratedServiceController } from "../controllers/generatedService.controller";

const router = Router();

/**
 * @swagger
 * /api/servicios:
 *   get:
 *     summary: Obtiene todos los servicios dinámicos disponibles para una fecha y tramo exacto
 *     tags: [Servicios]
 *     parameters:
 *       - in: query
 *         name: origen
 *         required: true
 *         schema:
 *           type: string
 *         description: Ciudad de origen
 *       - in: query
 *         name: destino
 *         required: true
 *         schema:
 *           type: string
 *         description: Ciudad de destino
 *       - in: query
 *         name: fecha
 *         required: true
 *         schema:
 *           type: string
 *         description: Fecha de búsqueda (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Lista de servicios con el tramo consultado
 */
router.get("/", GeneratedServiceController.getServices);

export default router;
