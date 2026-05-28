import type { PrincipalService } from "../application/PrincipalService.js";
import type { AuthenticatedRequest } from "../../../middleware/auth.middleware.js";
import type { Response, NextFunction } from 'express'

export class PrincipalController {
    constructor(private readonly principalService: PrincipalService) {}

    createPrincipal = async (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
        try {
            const { email, password, fullName } = request.body;

            const userId = request.user!.userId as string;
            const userRole = request.user!.role as string;
            const userSchoolId = request.user!.schoolId as string;

            const record = await this.principalService.createPrincipal(email, password, fullName, userId, userRole, userSchoolId);
            response.status(201).json({ principal: record });
        } catch (error : any) {
            next(error);
        }
    }
}