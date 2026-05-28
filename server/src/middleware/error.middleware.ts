import type { Request, Response, NextFunction } from 'express';
import { BaseDomainError } from "../modules/errors/domain/CustomErrors.js";

export const globalErrorHandler = (error: Error, request: Request, response: Response, next: NextFunction) => {
    if (error instanceof BaseDomainError) {
        return response.status(error.statusCode).json({ message: error.message });
    }

    console.error("Unhandled Internal Crash:", error);
    return response.status(500).json({
        status: "fatal",
        message: "Algo salió mal en el servidor"
    });
};