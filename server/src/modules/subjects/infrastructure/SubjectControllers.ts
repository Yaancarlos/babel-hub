import type { SubjectServices } from "../application/SubjectServices.js";
import type { AuthenticatedRequest } from "../../../middleware/auth.middleware.js";
import type { Response, NextFunction } from "express";

export class SubjectControllers {
    constructor(private readonly subjectServices : SubjectServices ) {}

    getSubjectsByArea = async (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
        try {
            const areaId = request.params.areaId as string;

            const userSchoolId = request.user!.schoolId as string;

            const records = await this.subjectServices.getSubjectsByArea(areaId, userSchoolId);
            response.status(200).json({ subjects: records });
        } catch (error : any) {
            next(error)
        }
    }

    getAvailableSubjects = async (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
        try {
            const courseId = request.query.courseId as string;

            const userSchoolId = request.user!.schoolId as string;

            const records = await this.subjectServices.getAvailableSubjects(courseId, userSchoolId);
            response.status(200).json({ availableSubjects: records })
        } catch (error : any) {
            next(error)
        }
    }

    createSubject = async (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
        try {
            const { name, areaId } = request.body;

            const userSchoolId = request.user!.schoolId as string;
            const userRole = request.user!.role as string;
            const userId = request.user!.userId as string;

            const record = await this.subjectServices.createSubject(name, areaId, userId, userRole, userSchoolId);
            response.status(201).json({ subject: record });
        } catch (error : any) {
            next(error)
        }
    }

    updateSubject = async (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
        try {
            const id = request.params.id as string;
            const { name, areaId } = request.body;

            const userSchoolId = request.user!.schoolId as string;
            const userRole = request.user!.role as string;
            const userId = request.user!.userId as string;

            await this.subjectServices.updateSubject(id, name, areaId, userId, userRole, userSchoolId);
            response.status(204).send();
        } catch (error : any) {
            next(error)
        }
    }

    deleteSubject = async (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
        try {
            const id = request.params.id as string;

            const userSchoolId = request.user!.schoolId as string;
            const userRole = request.user!.role as string;
            const userId = request.user!.userId as string;

            await this.subjectServices.deleteSubject(id, userId, userRole, userSchoolId);
            response.status(204).send();
        } catch (error : any) {
            next(error)
        }
    }
}