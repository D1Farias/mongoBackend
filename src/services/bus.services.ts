import { IBus, BusModel } from "../models/bus";

export class BusService {
    async create(busData: Partial<IBus>): Promise<IBus> {
        const bus = new BusModel(busData);
        return await bus.save();
    }

    async getAll(): Promise<IBus[]> {
        return await BusModel.find();
    }

    async getById(id: number): Promise<IBus | null> {
        return await BusModel.findOne({ numericId: id });
    }

    async delete(id: number): Promise<IBus | null> {
        return await BusModel.findOneAndDelete({ numericId: id });
    }
}
