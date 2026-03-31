import { ITrip, TripModel } from "../models/trip";

export class TripService {
    async create(tripData: Partial<ITrip>): Promise<ITrip> {
        const trip = new TripModel(tripData);
        return await trip.save();
    }

    async getAll(): Promise<ITrip[]> {
        return await TripModel.find();
    }
}

