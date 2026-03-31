import { Router, Request, Response } from "express";
import { TripService } from "../services/trip.services";
import { tripValidationSchema } from "../models/trip";

const router = Router();
const tripService = new TripService();

router.post("/", async (req: Request, res: Response) => {
    try {
        const validatedData = tripValidationSchema.parse(req.body);
        const trip = await tripService.create(validatedData as any);
        res.status(201).json(trip);
    } catch (error: any) {
        res.status(400).json({ message: error.errors || error.message });
    }
});

router.get("/", async (_req: Request, res: Response) => {
    try {
        const trips = await tripService.getAll();
        res.status(200).json(trips);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/:id", async (req: Request, res: Response) => {
    try {
        const trip = await tripService.getById(req.params.id as string);
        if (!trip) return res.status(404).json({ message: "Viaje no encontrado" });
        res.status(200).json(trip);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

router.put("/:id", async (req: Request, res: Response) => {
    try {
        const validatedData = tripValidationSchema.partial().parse(req.body);
        const trip = await tripService.update(req.params.id as string, validatedData as any);
        if (!trip) return res.status(404).json({ message: "Viaje no encontrado" });
        res.status(200).json(trip);
    } catch (error: any) {
        res.status(400).json({ message: error.errors || error.message });
    }
});

router.delete("/:id", async (req: Request, res: Response) => {
    try {
        const trip = await tripService.delete(req.params.id as string);

        if (!trip) return res.status(404).json({ message: "Viaje no encontrado" });
        res.status(200).json({ message: "Viaje eliminado correctamente" });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

export default router;

