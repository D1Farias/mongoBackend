import { Schema, model, Document } from "mongoose";
import { z } from "zod";
import { CounterModel } from "./counter";

export interface ICity {
    nombre: string;
    minutosOffset: number;
}

export interface IRouteBlock {
    origen: string;
    destino: string;
    offsetSalida: number;
    offsetLlegada: number;
    indiceOrigen: number;
    indiceDestino: number;
}

export interface IRouteMaster extends Document {
    numericId: number;
    nombre: string;
    ciudades: ICity[];
    tramos: IRouteBlock[];
}

const RouteMasterSchema = new Schema<IRouteMaster>({
    numericId: { type: Number, unique: true },
    nombre: { type: String, required: true },
    ciudades: [{
        nombre: { type: String, required: true },
        minutosOffset: { type: Number, required: true }
    }],
    tramos: [{
        origen: String,
        destino: String,
        offsetSalida: Number,
        offsetLlegada: Number,
        indiceOrigen: Number,
        indiceDestino: Number
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

RouteMasterSchema.pre("save", async function () {
    if (this.isModified('ciudades')) {
        // Ordenar ciudades por minutosOffset para asegurar la secuencia
        this.ciudades.sort((a, b) => a.minutosOffset - b.minutosOffset);

        const tramos: IRouteBlock[] = [];
        for (let i = 0; i < this.ciudades.length; i++) {
            for (let j = i + 1; j < this.ciudades.length; j++) {
                tramos.push({
                    origen: this.ciudades[i].nombre,
                    destino: this.ciudades[j].nombre,
                    offsetSalida: this.ciudades[i].minutosOffset,
                    offsetLlegada: this.ciudades[j].minutosOffset,
                    indiceOrigen: i,
                    indiceDestino: j
                });
            }
        }
        this.tramos = tramos;
    }

    if (this.isNew) {
        const counter = await CounterModel.findOneAndUpdate(
            { _id: "routeMasterId" },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        this.numericId = counter ? counter.seq : 1;
    }
});

export const RouteMasterModel = model<IRouteMaster>("RouteMaster", RouteMasterSchema);

export const routeMasterValidationSchema = z.object({
    nombre: z.string().min(3),
    ciudades: z.array(z.object({
        nombre: z.string().min(2),
        minutosOffset: z.number().min(0)
    })).min(2, "Se requieren al menos 2 ciudades")
}).refine(data => {
    const nombres = data.ciudades.map(c => c.nombre);
    return new Set(nombres).size === nombres.length;
}, {
    message: "No puede haber ciudades duplicadas en la ruta",
    path: ["ciudades"]
});
