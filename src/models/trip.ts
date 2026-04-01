import { Schema, model, Document } from "mongoose";
import { z } from "zod";
import { CounterModel } from "./counter";

export interface ITrip extends Document {
    numericId: number;
    busId: number;
    origen: string;
    destino: string;
    fecha: Date;
    status: 'Programado' | 'En Curso' | 'Finalizado' | 'Cancelado';
    occupiedSeats: string[];
}

const TripSchema = new Schema<ITrip>({
    numericId: { type: Number, unique: true },
    busId: { type: Number, required: true },
    origen: { type: String, required: true },
    destino: { type: String, required: true },
    fecha: { type: Date, required: true },
    status: { 
        type: String, 
        enum: ['Programado', 'En Curso', 'Finalizado', 'Cancelado'],
        default: 'Programado'
    },
    occupiedSeats: { type: [String], default: [] }
}, { 
    timestamps: true,
    id: false,
    toJSON: {
        transform: (_doc, ret: any) => {
            if (ret.numericId !== undefined) {
                ret.id = ret.numericId;
            }
            if (ret.fecha) {
                // Formatear fecha para la salida JSON
                const d = new Date(ret.fecha);
                const day = String(d.getDate()).padStart(2, '0');
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const year = d.getFullYear();
                const hours = String(d.getHours()).padStart(2, '0');
                const minutes = String(d.getMinutes()).padStart(2, '0');
                ret.fecha = `${day}/${month}/${year} ${hours}:${minutes}`;
            }
            delete ret.numericId;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    }
});




// Hook pre-save para el ID autoincremental
TripSchema.pre("save", async function () {
    if (this.isNew) {
        const counter = await CounterModel.findOneAndUpdate(
            { _id: "tripId" },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        this.numericId = counter ? counter.seq : 1;
    }
});

export const TripModel = model<ITrip>("Trip", TripSchema);

export const tripValidationSchema = z.object({
    busId: z.number().min(1),
    origen: z.string().min(3),
    destino: z.string().min(3),
    fecha: z.string().regex(/^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}$/, "Formato inválido (DD/MM/YYYY HH:mm)").transform((val) => {
        const [datePart, timePart] = val.split(" ");
        const [day, month, year] = datePart.split("/").map(Number);
        const [hours, minutes] = timePart.split(":").map(Number);
        return new Date(year, month - 1, day, hours, minutes);
    }),
    status: z.enum(['Programado', 'En Curso', 'Finalizado', 'Cancelado']).optional(),
    occupiedSeats: z.array(z.string()).optional()
});




