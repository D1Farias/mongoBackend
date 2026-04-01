import { ITicket, TicketModel } from "../models/ticket";

export class TicketService {
    async getAll(): Promise<ITicket[]> {
        return await TicketModel.find();
    }

    async getByTripId(tripId: number): Promise<ITicket[]> {
        return await TicketModel.find({ tripId });
    }

    async getById(id: number): Promise<ITicket | null> {
        return await TicketModel.findOne({ numericId: id });
    }
}
