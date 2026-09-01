import type { AssignmentService } from "../application/AssignmentService.js";
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
        } catch (error) {
            next(error);
        }
    }

    createAssignment = async (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
        try {
            const { assignmentName, assignmentDueAt, classId, assessmentId, periodId } = request.body;

            const userId = request.user!.userId as string;
            const userRole = request.user!.role! as string;
            const userSchoolId = request.user!.schoolId as string;

            await this.assignmentService.createAssignment(assignmentName, assignmentDueAt, classId, assessmentId, periodId, userId, userRole, userSchoolId);
            response.status(201).send();
        } catch (error: any) {
            next(error);
        }
    }

    updateAssignment = async (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
        try {
            const assignmentId = request.params.assignmentId as string;
            const { assignmentName, assignmentDueAt } = request.body;

            const userId = request.user!.userId as string;
            const userRole = request.user!.role! as string;
            const userSchoolId = request.user!.schoolId as string;

            await this.assignmentService.updateAssignment(
                assignmentId,
                { assignmentName, assignmentDueAt },
                userId, userRole, userSchoolId
            );
            response.status(200).send();
        } catch (error) {
            next(error);
        }
    }

    deleteAssignment = async (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
        try {
            const assignmentId = request.params.assignmentId as string;

            const userId = request.user!.userId as string;
            const userRole = request.user!.role! as string;
            const userSchoolId = request.user!.schoolId as string;

            await this.assignmentService.deleteAssignment(assignmentId, userId, userRole, userSchoolId);
            response.status(200).send();
        } catch (error) {
            next(error);
        }
    }
}