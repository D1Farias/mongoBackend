import { Schema, model, Document } from "mongoose";
import { z } from "zod";

export interface ITrip extends Document {
    origen: string;
    destino: string;
    fecha: Date;
    busLayout: number[][];
}

const TripSchema = new Schema<ITrip>({
    origen: { type: String, required: true },
    destino: { type: String, required: true },
    fecha: { type: Date, required: true },
    busLayout: { type: [[Number]], required: true }
}, { timestamps: true });

export const TripModel = model<ITrip>("Trip", TripSchema);

export const tripValidationSchema = z.object({
    origen: z.string().min(3),
    destino: z.string().min(3),
    fecha: z.coerce.date(),
    busLayout: z.array(z.array(z.number()))
});
