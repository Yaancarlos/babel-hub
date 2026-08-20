import type { GradeService } from "../application/GradeService.js";
import type { AuthenticatedRequest } from "../../../middleware/auth.middleware.js";
import type { NextFunction, Response } from "express";
import type {GradeByAssignment} from "../domain/Grade.types.js";

export class GradeController {
    constructor( private readonly gradeService: GradeService ) {}

    bulkUpsertGrades = async (request: AuthenticatedRequest, response: Response, next: NextFunction): Promise<void> => {
        try {
            const assignmentId = request.params.assignmentId as string;
            const classId = request.params.classId as string;

            const { records } = request.body;

            console.log(classId, assignmentId, records);

            const userSchoolId = request.user!.schoolId as string;
            const userRole = request.user!.role as string;
            const userId = request.user!.userId as string;

            await this.gradeService.bulkUpsertGrades(classId, assignmentId, records, { userId, userRole, userSchoolId });
            response.status(201).send();
        } catch (error : any) {
            next(error);
        }
    }
}