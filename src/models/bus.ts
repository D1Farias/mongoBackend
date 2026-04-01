import { Schema, model, Document } from "mongoose";
import { z } from "zod";
import { CounterModel } from "./counter";

export interface IBus extends Document {
    numericId: number;
    patente: string;
    modelo: string;
    capacidad: number;
    asientos: string[];
}

const BusSchema = new Schema<IBus>({
    numericId: { type: Number, unique: true },
    patente: { type: String, required: true, unique: true },
    modelo: { type: String, required: true },
    capacidad: { type: Number, required: true },
    asientos: { type: [String], required: true }
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

BusSchema.pre("save", async function () {
    if (this.isNew) {
        const counter = await CounterModel.findOneAndUpdate(
            { _id: "busId" },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        this.numericId = counter ? counter.seq : 1;
    }
});

export const BusModel = model<IBus>("Bus", BusSchema);

export const busValidationSchema = z.object({
    patente: z.string().min(5),
    modelo: z.string().min(3),
    capacidad: z.number().min(1),
    asientos: z.array(z.string()).min(1)
});
