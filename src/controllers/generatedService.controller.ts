import { Request, Response } from "express";
import { ServiceTemplateModel } from "../models/serviceTemplate";
import { GeneratedServiceModel } from "../models/generatedService";
import { RouteMasterModel } from "../models/routeMaster";

export class GeneratedServiceController {

    static async getServices(req: Request, res: Response) {
        try {
            const origen = req.query.origen as string;
            const destino = req.query.destino as string;
            const fechaStr = req.query.fecha as string;

            if (!origen || !destino || !fechaStr) {
                return res.status(400).json({ message: "Se requiere origen, destino y fecha (YYYY-MM-DD)" });
            }

            // Normalizar fecha
            const [year, month, day] = fechaStr.split("-").map(Number);
            const queriedDate = new Date(year, month - 1, day);
            const dayOfWeek = queriedDate.getDay();

            // Buscar RouteMasters que tengan origen y destino en el orden correcto
            const routeMasters = await RouteMasterModel.find();
            
            const validRouteMasters = routeMasters.filter(rm => {
                return rm.tramos.some(t => t.origen === origen && t.destino === destino);
            });

            if (validRouteMasters.length === 0) {
                return res.status(200).json({ data: [] }); // No hay ruta
            }

            const routeMasterIds = validRouteMasters.map(rm => rm.numericId);

            // Buscar templates que operen hoy para esas rutas
            const templates = await ServiceTemplateModel.find({
                rutaMaestraId: { $in: routeMasterIds },
                diasSemana: dayOfWeek
            });

            const results = [];

            for (const template of templates) {
                // Verificar si ya existe el GeneratedService
                let generated = await GeneratedServiceModel.findOne({
                    plantillaServicioId: template.numericId,
                    fecha: queriedDate
                });

                if (!generated) {
                    // Generarlo On-The-Fly
                    const routeM = validRouteMasters.find(rm => rm.numericId === template.rutaMaestraId);
                    if (!routeM) continue;

                    const [h, m] = template.horaSalida.split(":").map(Number);
                    
                    const ciudadesConTiempo = routeM.ciudades.map(c => {
                        const estimated = new Date(queriedDate);
                        estimated.setHours(h, m + c.minutosOffset, 0, 0);
                        return {
                            nombre: c.nombre,
                            minutosOffsetReal: c.minutosOffset,
                            horaLlegadaEstimada: estimated
                        };
                    });

                    generated = new GeneratedServiceModel({
                        plantillaServicioId: template.numericId,
                        rutaMaestraId: template.rutaMaestraId,
                        fecha: queriedDate,
                        ciudades: ciudadesConTiempo
                    });
                    
                    await generated.save();
                }

                // Filtrar el tramo relevante para retornar
                const cityOrigin = generated.ciudades.find(c => c.nombre === origen);
                const cityDest = generated.ciudades.find(c => c.nombre === destino);

                if (cityOrigin && cityDest && cityOrigin.minutosOffsetReal < cityDest.minutosOffsetReal) {
                    results.push({
                        servicioId: generated.numericId,
                        plantillaServicioId: template.numericId,
                        fechaSalida: cityOrigin.horaLlegadaEstimada,
                        fechaLlegada: cityDest.horaLlegadaEstimada,
                        layoutBusId: template.layoutBusId,
                        precios: {
                            primero: template.precioPrimero,
                            segundo: template.precioSegundo
                        }
                    });
                }
            }

            // Ordenar por hora de salida
            results.sort((a, b) => a.fechaSalida.getTime() - b.fechaSalida.getTime());

            res.status(200).json({ data: results });

        } catch (error) {
            res.status(500).json({ message: "Error interno del servidor", error });
        }
    }
}
