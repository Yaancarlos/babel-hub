import type { ScaleService } from "../application/ScaleService.js";
import type { NextFunction, Response } from "express";
import type { AuthenticatedRequest } from "../../../middleware/auth.middleware.js";

export class ScaleControllers {
    constructor(private readonly scaleService: ScaleService) {}

    getScales = async (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
        try {
            const userSchoolId = request.user!.schoolId as string;

            const records = await this.scaleService.getScales(userSchoolId);
            response.status(200).json({ scales: records });
        } catch (error: any) {
            next(error);
        }
    }
}