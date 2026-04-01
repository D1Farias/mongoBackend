import { ITrip, TripModel } from "../models/trip";
import { BusModel } from "../models/bus";
import { TicketModel } from "../models/ticket";

export class TripService {
    async create(tripData: Partial<ITrip>): Promise<ITrip> {
        // Validar que el bus existe
        const bus = await BusModel.findOne({ numericId: tripData.busId });
        if (!bus) throw new Error("El bus especificado no existe");

        const trip = new TripModel(tripData);
        return await trip.save();
    }

    async getAll(): Promise<ITrip[]> {
        return await TripModel.find();
    }

    async getById(id: number): Promise<ITrip | null> {
        return await TripModel.findOne({ numericId: id });
    }

    async update(id: number, tripData: Partial<ITrip>): Promise<ITrip | null> {
        return await TripModel.findOneAndUpdate({ numericId: id }, tripData, { new: true });
    }

    async delete(id: number): Promise<ITrip | null> {
        return await TripModel.findOneAndDelete({ numericId: id });
    }

    async reserveSeat(tripId: number, seatNumber: string, pasajero: string): Promise<any> {
        const trip = await TripModel.findOne({ numericId: tripId });
        if (!trip) throw new Error("Viaje no encontrado");

        const bus = await BusModel.findOne({ numericId: trip.busId });
        if (!bus) throw new Error("Bus asociado al viaje no encontrado");

        // 1. Validar Capacidad máxima
        if (trip.occupiedSeats.length >= bus.capacidad) {
            throw new Error(`Capacidad del bus agotada (${bus.capacidad} asientos)`);
        }

        // 2. Validar que el asiento existe en el bus
        if (!bus.asientos.includes(seatNumber)) {
            throw new Error(`El asiento ${seatNumber} no existe en este bus`);
        }

        // 3. Validar que el asiento no esté ocupado
        if (trip.occupiedSeats.includes(seatNumber)) {
            throw new Error(`El asiento ${seatNumber} ya está reservado`);
        }

        // 4. Crear Ticket
        const ticket = new TicketModel({
            tripId,
            asiento: seatNumber,
            pasajero
        });
        await ticket.save();

        // 5. Actualizar lista de ocupados en el Viaje
        trip.occupiedSeats.push(seatNumber);
        await trip.save();

        return { trip, ticket };
    }
}





