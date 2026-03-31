import { Trip } from "../models/trip";

export class TripService {
    private trips: Trip[] = [];

    create(trip: Trip): Trip {
        this.trips.push(trip);
        return trip;
    }

    getAll(): Trip[] {
        return this.trips;

    }
}
