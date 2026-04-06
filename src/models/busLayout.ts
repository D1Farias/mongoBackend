import { Schema, model, Document } from "mongoose";
import { z } from "zod";
import { CounterModel } from "./counter";

export interface IAsientoConfig {
    numeroAsiento: string;
    piso: number;
    tipo: string;
}

export interface IBusLayout extends Document {
    numericId: number;
    nombre: string;
    pisos: number;
    asientos: IAsientoConfig[];
}

const BusLayoutSchema = new Schema<IBusLayout>({
    numericId: { type: Number, unique: true },
    nombre: { type: String, required: true },
    pisos: { type: Number, required: true },
    asientos: [{
        numeroAsiento: { type: String, required: true },
        piso: { type: Number, required: true },
        tipo: { type: String, required: true }
    }]
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

BusLayoutSchema.pre("save", async function () {
    if (this.isNew) {
        const counter = await CounterModel.findOneAndUpdate(
            { _id: "busLayoutId" },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        this.numericId = counter ? counter.seq : 1;
    }
});

export const BusLayoutModel = model<IBusLayout>("BusLayout", BusLayoutSchema);

export const busLayoutValidationSchema = z.object({
    nombre: z.string().min(3),
    pisos: z.number().min(1).max(3),
    asientos: z.array(z.object({
        numeroAsiento: z.string().min(1),
        piso: z.number().min(1),
        tipo: z.string().min(2)
    })).min(1)
});

