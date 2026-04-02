import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Bus Reservation API (Multi-tramo)",
            version: "2.5.0",
            description: "API para la gestión de autobuses y reservas por tramos en español.",
        },
        servers: [
            {
                url: "http://localhost:3000",
                description: "Servidor Local",
            },
        ],
        components: {
            schemas: {
                RutaMaestra: {
                    type: "object",
                    properties: {
                        id: { type: "number", example: 1 },
                        nombre: { type: "string", example: "Ruta Sur" },
                        ciudades: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    nombre: { type: "string", example: "Santiago" },
                                    minutosOffset: { type: "number", example: 0 }
                                }
                            }
                        }
                    }
                },
                LayoutBus: {
                    type: "object",
                    properties: {
                        id: { type: "number", example: 1 },
                        nombre: { type: "string", example: "Dos Pisos 40 Asientos" },
                        pisos: { type: "number", example: 2 },
                        asientos: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    numeroAsiento: { type: "string", example: "1A" },
                                    piso: { type: "number", example: 1 },
                                    tipo: { type: "string", example: "Salón Cama" }
                                }
                            }
                        }
                    }
                },
                PlantillaServicio: {
                    type: "object",
                    properties: {
                        id: { type: "number", example: 1 },
                        rutaMaestraId: { type: "number", example: 1 },
                        diasSemana: { type: "array", items: { type: "number" }, example: [1,2,3,4,5] },
                        horaSalida: { type: "string", example: "08:30" },
                        layoutBusId: { type: "number", example: 1 },
                        descripcionTipoBus: { type: "string", example: "Semi Cama" },
                        descripcionAsientoPrimero: { type: "string", example: "Premium" },
                        precioPrimero: { type: "number", example: 15000 },
                        terminalOrigen: { type: "string", example: "Terminal Sur" },
                        terminalDestino: { type: "string", example: "Terminal principal" }
                    }
                },
                Reserva: {
                    type: "object",
                    properties: {
                        servicioId: { type: "number", example: 1 },
                        numeroAsiento: { type: "string", example: "1A" },
                        origen: { type: "string", example: "Santiago" },
                        destino: { type: "string", example: "Talca" }
                    }
                }
            },
        },
    },
    apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
