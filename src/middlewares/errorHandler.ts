import { Request, Response, NextFunction } from "express";

export const errorHandler = (
    err: any,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    console.error(err.stack);

    if (err.name === "ZodError") {
        return res.status(400).json({
            message: "Error de validación",
            errors: err.errors
        });
    }

    if (err.name === "CastError") {
        return res.status(400).json({
            message: "ID de recurso inválido"
        });
    }

    const status = err.status || 500;
    const message = err.message || "Error interno del servidor";

    res.status(status).json({ message });
};
