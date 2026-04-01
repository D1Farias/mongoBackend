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
            message: "Los datos enviados no son válidos para esta operación",
            error: err.errors
        });
    }

    if (err.name === "CastError") {
        return res.status(400).json({
            message: "El formato del identificador proporcionado no es correcto",
            error: err.message
        });
    }

    const status = err.status || 500;
    const message = err.message || "Ha ocurrido un error inesperado en el servidor";

    res.status(status).json({ 
        message,
        error: process.env.NODE_ENV === "development" ? err.stack : undefined 
    });
};

