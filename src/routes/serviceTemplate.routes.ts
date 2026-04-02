import { Router } from "express";
import { ServiceTemplateController } from "../controllers/serviceTemplate.controller";

const router = Router();

/**
 * @swagger
 * /api/plantilla-servicio:
 *   post:
 *     summary: Crea una nueva plantilla de servicio
 *     tags: [Plantillas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PlantillaServicio'
 *     responses:
 *       201:
 *         description: Plantilla creada exitosamente
 */
router.post("/", ServiceTemplateController.create);

/**
 * @swagger
 * /api/plantilla-servicio:
 *   get:
 *     summary: Obtiene todas las plantillas de servicio
 *     tags: [Plantillas]
 *     responses:
 *       200:
 *         description: Lista de plantillas
 */
router.get("/", ServiceTemplateController.getAll);

/**
 * @swagger
 * /api/plantilla-servicio/{id}:
 *   get:
 *     summary: Obtiene una plantilla específica
 *     tags: [Plantillas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalles de la plantilla
 */
router.get("/:id", ServiceTemplateController.getById);

export default router;
