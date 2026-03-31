import { Router, Request, Response } from "express";
import { TripService } from "../services/trip.services";

const router = Router();
const tripService = new TripService();

router.post("/", async (req: Request, res: Response) => {
    try {
        const trip = await tripService.create(req.body);
        res.status(201).json(trip);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
});

router.get("/", async (req: Request, res: Response) => {
    try {
        const trips = await tripService.getAll();
        res.status(200).json(trips);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
