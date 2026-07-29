import type { GradingTemplateService } from "../application/GradingTemplateService.js";
import type { AuthenticatedRequest } from "../../../middleware/auth.middleware.js";
import type { Response, NextFunction } from "express";

export class GradingTemplateController {
    constructor(private readonly gradingTemplateService: GradingTemplateService) {}

    getGradingTemplates = async (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
        try {
            const userSchoolId = request.user!.schoolId as string;

            const records = await this.gradingTemplateService.getGradingTemplates(userSchoolId);
            response.status(200).send({ gradings: records });
        } catch (error:any) {
            next(error);
        }
    }

    getGradingTemplateDetails = async (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
        try {
            const gradingId = request.params.gradingId as string;
            const userSchoolId = request.user!.schoolId as string;

            const records = await this.gradingTemplateService.getGradingTemplateDetails(gradingId, userSchoolId);
            response.status(200).send({ gradings_details: records });
        } catch (error:any) {
            next(error);
        }
    }

    createGradingTemplate = async (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
        try {
            const { name, scaleId } = request.body;

            const userId = request.user!.userId as string;
            const userRole = request.user!.role as string;
            const userSchoolId = request.user!.schoolId as string;

            await this.gradingTemplateService.createGradingTemplate(name, scaleId, userId, userRole, userSchoolId);
            response.status(201).send();
        } catch (error:any) {
            next(error);
        }
    }

    updateGradingTemplate = async (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
        try {
            const gradingId = request.params.gradingId as string;
            const { name, scaleId } = request.body;

            const userId = request.user!.userId as string;
            const userRole = request.user!.role as string;
            const userSchoolId = request.user!.schoolId as string;

            await this.gradingTemplateService.updateGradingTemplate(gradingId, name, scaleId, userId, userRole, userSchoolId);
            response.status(200).send();
        } catch (error:any) {
            next(error);
        }
    }

    deleteGradingTemplate = async (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
        try {
            const gradingId = request.params.gradingId as string;

            const userId = request.user!.userId as string;
            const userRole = request.user!.role as string;
            const userSchoolId = request.user!.schoolId as string;

            await this.gradingTemplateService.deleteGradingTemplate(gradingId, userId, userRole, userSchoolId);
            response.status(200).send();
        } catch (error:any) {
            next(error);
        }
    }

}