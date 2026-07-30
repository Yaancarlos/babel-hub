import type { AuthenticatedRequest } from "../../../middleware/auth.middleware.js";
import type { NextFunction, Response } from "express";
import type { AssessmentService } from "../application/AssessmentService.js";

export class AssessmentController {
    constructor(private readonly assessmentService: AssessmentService) {}

    getAssessments = async (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
        try {
            const userSchoolId = request.user!.schoolId as string;

            const records = await this.assessmentService.getAssessments(userSchoolId);
            response.status(200).json({ assessments: records });
        } catch (error : any) {
            next(error);
        }
    }

    createAssessment = async (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
        try {
            const { name, weight, gradingTemplateId } = request.body;

            const userId = request.user!.userId as string;
            const userRole = request.user!.role as string;
            const userSchoolId = request.user!.schoolId as string;

            await this.assessmentService.createAssessment(name, weight, gradingTemplateId, userId, userRole, userSchoolId);
            response.status(201).send();
        } catch (error : any) {
            next(error);
        }
    }

    deleteAssessment = async (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
        try {
            const assessmentId = request.params.assessmentId as string;

            const userId = request.user!.userId as string;
            const userRole = request.user!.role as string;
            const userSchoolId = request.user!.schoolId as string;

            await this.assessmentService.deleteAssessment(assessmentId, userId, userRole, userSchoolId);
            response.status(204).send();
        } catch (error : any) {
            next(error);
        }
    }

    updateAssessment = async (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
        try {
            const assessmentId = request.params.assessmentId as string;
            const { name, weight, gradingTemplateId } = request.body;

            const userId = request.user!.userId as string;
            const userRole = request.user!.role as string;
            const userSchoolId = request.user!.schoolId as string;

            await this.assessmentService.updateAssessment(assessmentId, name, weight, gradingTemplateId, userId, userRole, userSchoolId);
            response.status(204).send();
        } catch (error : any) {
            next(error);
        }
    }

}