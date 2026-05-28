import type { SchoolService } from "../application/SchoolService.js";
import type { AuthenticatedRequest } from "../../../middleware/auth.middleware.js";
import type { Response, NextFunction } from "express";

export class SchoolControllers {
    constructor(private readonly schoolService: SchoolService) {}

    createSchool = async (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
        try {
            const { schoolName, principalName, principalEmail, principalPassword } = request.body;

            const userId = request.user!.userId as string;
            const userSchoolId = request.user!.schoolId as string;
            const userRole = request.user!.role as string;

            const record = await this.schoolService.createSchool(schoolName, principalName, principalEmail, principalPassword, userId, userRole, userSchoolId);
            response.status(201).json({ school: record })
        } catch (error : any) {
            next(error);
        }
    }
}