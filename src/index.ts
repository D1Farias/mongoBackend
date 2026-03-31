import express, { Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import tripRoutes from "./routes/trip.routes";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/bus_backend";

mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ Conectado a MongoDB"))
    .catch((err) => console.error("❌ Error conectando a MongoDB:", err));

app.use("/api/trips", tripRoutes);

app.get("/", (req: Request, res: Response) => {
    res.send("API funcionando con TypeScript y MongoDB");
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor en http://localhost:${PORT}`);
});

