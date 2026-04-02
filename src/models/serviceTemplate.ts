import { Schema, model, Document } from "mongoose";
import { z } from "zod";
import { CounterModel } from "./counter";

export interface IServiceTemplate extends Document {
    numericId: number;
    rutaMaestraId: number;
    diasSemana: number[]; // 0 = Domingo, 1 = Lunes, ...
    horaSalida: string; // formato "HH:mm"
    layoutBusId: number;
    descripcionTipoBus: string;
    descripcionAsientoPrimero: string;
    descripcionAsientoSegundo?: string;
    precioPrimero: number;
    precioSegundo?: number;
    terminalOrigen: string;
    terminalDestino: string;
}

const ServiceTemplateSchema = new Schema<IServiceTemplate>({
    numericId: { type: Number, unique: true },
    rutaMaestraId: { type: Number, required: true },
    diasSemana: { type: [Number], required: true },
    horaSalida: { type: String, required: true },
    layoutBusId: { type: Number, required: true },
    descripcionTipoBus: { type: String, required: true },
    descripcionAsientoPrimero: { type: String, required: true },
    descripcionAsientoSegundo: { type: String },
    precioPrimero: { type: Number, required: true },
    precioSegundo: { type: Number },
    terminalOrigen: { type: String, required: true },
    terminalDestino: { type: String, required: true }
}, {
    timestamps: true,
    id: false,
    toJSON: {
        virtuals: true,
        transform: (_doc, ret: any) => {
            ret.id = ret.numericId;
            delete ret.numericId;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    },
    toObject: { virtuals: true }
});

// Virtual Populate
ServiceTemplateSchema.virtual('rutaMaestra', {
    ref: 'RouteMaster',
    localField: 'rutaMaestraId',
    foreignField: 'numericId',
    justOne: true
});

ServiceTemplateSchema.virtual('layoutBus', {
    ref: 'BusLayout',
    localField: 'layoutBusId',
    foreignField: 'numericId',
    justOne: true
});

ServiceTemplateSchema.pre("save", async function () {
    if (this.isNew) {
        const counter = await CounterModel.findOneAndUpdate(
            { _id: "serviceTemplateId" },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        this.numericId = counter ? counter.seq : 1;
    }
});

export const ServiceTemplateModel = model<IServiceTemplate>("ServiceTemplate", ServiceTemplateSchema);

export const serviceTemplateValidationSchema = z.object({
    rutaMaestraId: z.number().min(1),
    diasSemana: z.array(z.number().min(0).max(6)).min(1),
    horaSalida: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Formato HH:mm"),
    layoutBusId: z.number().min(1),
    descripcionTipoBus: z.string().min(2),
    descripcionAsientoPrimero: z.string().min(2),
    descripcionAsientoSegundo: z.string().optional(),
    precioPrimero: z.number().min(0),
    precioSegundo: z.number().optional(),
    terminalOrigen: z.string().min(2),
    terminalDestino: z.string().min(2)
});
