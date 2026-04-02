import { Schema, model, Document } from "mongoose";
import { CounterModel } from "./counter";

export interface ICiudadConTiempo {
    nombre: string;
    minutosOffsetReal: number;
    horaLlegadaEstimada: Date;
}

export interface IGeneratedService extends Document {
    numericId: number;
    plantillaServicioId: number;
    rutaMaestraId: number;
    fecha: Date; // La fecha base (inicio del viaje desde la primera ciudad)
    ciudades: ICiudadConTiempo[]; // La copia congelada del RouteMaster + tiempos exactos calculados
}

const GeneratedServiceSchema = new Schema<IGeneratedService>({
    numericId: { type: Number, unique: true },
    plantillaServicioId: { type: Number, required: true },
    rutaMaestraId: { type: Number, required: true },
    fecha: { type: Date, required: true },
    ciudades: [{
        nombre: { type: String, required: true },
        minutosOffsetReal: { type: Number, required: true },
        horaLlegadaEstimada: { type: Date, required: true }
    }]
}, {
    timestamps: true,
    id: false,
    toJSON: {
        transform: (_doc, ret: any) => {
            ret.id = ret.numericId;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    }
});

GeneratedServiceSchema.index({ fecha: 1, plantillaServicioId: 1 }, { unique: true });

GeneratedServiceSchema.pre("save", async function () {
    if (this.isNew) {
        const counter = await CounterModel.findOneAndUpdate(
            { _id: "generatedServiceId" },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        this.numericId = counter ? counter.seq : 1;
    }
});

export const GeneratedServiceModel = model<IGeneratedService>("GeneratedService", GeneratedServiceSchema);
