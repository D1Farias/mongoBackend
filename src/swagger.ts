import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Bus Reservation API",
            version: "1.0.0",
            description: "API para la gestión de buses y reserva de asientos en viajes.",
        },
        servers: [
            {
                url: "http://localhost:3000",
                description: "Servidor Local",
            },
        ],
        components: {
            schemas: {
                Bus: {
                    type: "object",
                    properties: {
                        id: { type: "number", example: 1 },
                        patente: { type: "string", example: "BBB-222" },
                        modelo: { type: "string", example: "Modelo F-100" },
                        capacidad: { type: "number", example: 40 },
                        asientos: { 
                            type: "array", 
                            items: { type: "string" }, 
                            example: ["A1", "A2", "B1", "B2"] 
                        },
                    },
                },
                Viaje: {
                    type: "object",
                    properties: {
                        id: { type: "number", example: 1 },
                        busId: { type: "number", example: 1 },
                        origen: { type: "string", example: "Madrid" },
                        destino: { type: "string", example: "Barcelona" },
                        fecha: { type: "string", example: "01/04/2026 15:30" },
                        occupiedSeats: { 
                            type: "array", 
                            items: { type: "string" }, 
                            example: ["A1"] 
                        },
                    },
                },
            },
        },
    },
    apis: ["./src/routes/*.ts"], // Ruta donde se encuentran los archivos con comentarios JSDoc
};

export const swaggerSpec = swaggerJsdoc(options);
