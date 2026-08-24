import type { ParentService } from "../application/ParentService.js";
import type { Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "../../../middleware/auth.middleware.js";

export class ParentControllers {
    constructor (private readonly parentService: ParentService) {}

    createParent = async (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
        try {
            const { email, password, firstName, middleName, firstLastName, secondLastName } = request.body;

            const userId = request.user!.userId as string;
            const userSchoolId = request.user!.schoolId as string;
            const userRole = request.user!.role as string;

            await this.parentService.createParent({ firstName, middleName, firstLastName, secondLastName, password, email }, { userId, userRole, userSchoolId });
            response.status(201).send();
        } catch (error : any) {
            next(error);
        }
    }
}