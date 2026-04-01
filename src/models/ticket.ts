import { Schema, model, Document } from "mongoose";
import { CounterModel } from "./counter";

export interface ITicket extends Document {
    numericId: number;
    tripId: number;
    asiento: string;
    pasajero: string;
}

const TicketSchema = new Schema<ITicket>({
    numericId: { type: Number, unique: true },
    tripId: { type: Number, required: true },
    asiento: { type: String, required: true },
    pasajero: { type: String, required: true }
}, {
    timestamps: true,
    id: false,
    toJSON: {
        transform: (_doc, ret: any) => {
            ret.id = ret.numericId;
            delete ret.numericId;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    }
});

TicketSchema.pre("save", async function () {
    if (this.isNew) {
        const counter = await CounterModel.findOneAndUpdate(
            { _id: "ticketId" },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        this.numericId = counter ? counter.seq : 1;
    }
});

export const TicketModel = model<ITicket>("Ticket", TicketSchema);
