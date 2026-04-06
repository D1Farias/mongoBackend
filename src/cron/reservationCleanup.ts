/*
import cron from "node-cron";
import { ReservationModel } from "../models/reservation";

export const startReservationCleanupCron = () => {
    // Se ejecuta cada 1 minuto
    cron.schedule("* * * * *", async () => {
        try {
            console.log("🧹 Ejecutando cron job: Limpieza de reservas temporales...");
            
            const result = await ReservationModel.updateMany(
                {
                    estado: 'reservado',
                    fechaExpiracion: { $lt: new Date() }
                },
                {
                    $set: { estado: 'cancelado' }
                }
            );

            if (result.modifiedCount > 0) {
                console.log(`✅ Liberados ${result.modifiedCount} asientos expirados.`);
            }
        } catch (error) {
            console.error("❌ Error en el cron job de limpieza de reservas:", error);
        }
    });

    console.log("⏰ Cron job de limpieza de reservas inicializado.");
}; */
