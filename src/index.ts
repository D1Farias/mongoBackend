import express, { Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import tripRoutes from "./routes/trip.routes";
import busRoutes from "./routes/bus.routes";
import ticketRoutes from "./routes/ticket.routes";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger";


import { errorHandler } from "./middlewares/errorHandler";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/bus_backend";

mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ Conectado a MongoDB"))
    .catch((err) => console.error("❌ Error conectando a MongoDB:", err));

app.use("/api/viajes", tripRoutes);
app.use("/api/buses", busRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.get("/", (req: Request, res: Response) => {
    res.send("API funcionando con TypeScript y MongoDB");
});

// Manejador de errores global
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`🚀 Servidor en http://localhost:${PORT}`);
});
