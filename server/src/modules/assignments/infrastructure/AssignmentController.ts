import type { AssignmentService } from "../application/AssigmentService.js";
import type { NextFunction, Response } from "express";
import type { AuthenticatedRequest } from "../../../middleware/auth.middleware.js";

export class AssignmentController {
    constructor( private readonly assignmentService: AssignmentService ) {}

    getAssignmentOverview = async (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
        try {
            const courseId = request.params.courseId as string;
            const classId = request.params.classId as string;

            const userSchoolId = request.user!.schoolId as string;

            const records = await this.assignmentService.getAssignmentsOverview(courseId, classId, userSchoolId);
            response.status(200).json({ assignments: records });
        } catch (error : any) {
            next(error);
        }
    }
}