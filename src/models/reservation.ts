import { Schema, model, Document } from "mongoose";
import { z } from "zod";
import { CounterModel } from "./counter";

export interface IReservation extends Document {
    numericId: number;
    servicioId: number;
    numeroAsiento: string;
    origen: string;
    destino: string;
    indiceOrigen: number;
    indiceDestino: number;
    estado: 'reservado' | 'confirmado' | 'cancelado';
    fechaExpiracion: Date;
    pasajero?: string;
    documento?: string;
}

const ReservationSchema = new Schema<IReservation>({
    numericId: { type: Number, unique: true },
    servicioId: { type: Number, required: true },
    numeroAsiento: { type: String, required: true },
    origen: { type: String, required: true },
    destino: { type: String, required: true },
    indiceOrigen: { type: Number, required: true },
    indiceDestino: { type: Number, required: true },
    estado: { 
        type: String, 
        enum: ['reservado', 'confirmado', 'cancelado'], 
        default: 'reservado' 
    },
    fechaExpiracion: { 
        type: Date, 
        default: () => new Date(Date.now() + 10 * 60 * 1000) 
    },
    pasajero: { type: String },
    documento: { type: String }
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

ReservationSchema.pre("save", async function () {
    if (this.isNew) {
        const counter = await CounterModel.findOneAndUpdate(
            { _id: "reservationId" },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        this.numericId = counter ? counter.seq : 1;
        
        // Si el estado es reservado y no tiene expiración, por defecto expira en 10 min
        if (this.estado === 'reservado' && !this.fechaExpiracion) {
            this.fechaExpiracion = new Date(Date.now() + 10 * 60 * 1000);
        }
    }
});

export const ReservationModel = model<IReservation>("Reservation", ReservationSchema);

export const reservationValidationSchema = z.object({
    servicioId: z.number(),
    numeroAsiento: z.string(),
    origen: z.string(),
    destino: z.string()
});

export const confirmationValidationSchema = z.object({
    reservaId: z.number(),
    pasajero: z.string().min(2),
    documento: z.string().min(2)
});
