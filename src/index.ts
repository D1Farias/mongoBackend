import express, { Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import routeMasterRoutes from "./routes/routeMaster.routes";
import busLayoutRoutes from "./routes/busLayout.routes";
import serviceTemplateRoutes from "./routes/serviceTemplate.routes";
import serviceRoutes from "./routes/service.routes";
import reservationRoutes from "./routes/reservation.routes";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger";
// import { startReservationCleanupCron } from "./cron/reservationCleanup";

import { errorHandler } from "./middlewares/errorHandler";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/bus_backend";

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("✅ Conectado a MongoDB");
        // startReservationCleanupCron();
    })
    .catch((err) => console.error("❌ Error conectando a MongoDB:", err));

app.use("/api/ruta-maestra", routeMasterRoutes);
app.use("/api/layout-bus", busLayoutRoutes);
app.use("/api/plantilla-servicio", serviceTemplateRoutes);
app.use("/api/servicios", serviceRoutes);
app.use("/api/reservas", reservationRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.get("/", (req: Request, res: Response) => {
    res.send("API funcionando con TypeScript y MongoDB");
});

// Manejador de errores global
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`🚀 Servidor en http://localhost:${PORT}`);
});
