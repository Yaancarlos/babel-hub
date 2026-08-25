import type { SchoolService } from "../application/SchoolService.js";
import type { AuthenticatedRequest } from "../../../middleware/auth.middleware.js";
import type { Response, NextFunction } from "express";

export class SchoolControllers {
    constructor(private readonly schoolService: SchoolService) {}

    createSchool = async (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
        try {
            const { schoolName, firstName, middleName, FirstLastName, secondLastName, principalEmail, principalPassword } = request.body;

            const userId = request.user!.userId as string;
            const userRole = request.user!.role as string;

            // check this one for admin user, they don't hold a school id
            const userSchoolId = request.user!.schoolId as string;

            const record = await this.schoolService.createSchool(schoolName, firstName, middleName, FirstLastName, secondLastName, principalEmail, principalPassword, userId, userRole, userSchoolId);
            response.status(201).json({ school: record })
        } catch (error : any) {
            next(error);
        }
    }
}