import type { ClassService } from "../application/ClassService.js";
import type { AuthenticatedRequest } from "../../../middleware/auth.middleware.js";
import type { Response, NextFunction } from "express";

export class ClassControllers {
    constructor( private readonly classServices : ClassService ) {}

    getClassDetails = async (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
        try {
            const id = request.params.id as string;
            const schoolId = request.user!.schoolId as string;
            const isActive = true;

            const records = await this.classServices.getClassDetails(id, schoolId, isActive);
            response.status(200).json(records);
        } catch (error : any) {
            next(error);
        }
    }

    createClass = async (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
        try {
            const { courseId, subjectId, teacherId } = request.body;

            const userId = request.user!.userId as string;
            const userRole = request.user!.role as string;
            const userSchoolId = request.user!.schoolId as string;

            const record = await this.classServices.createClass(courseId, subjectId, teacherId, userId, userRole, userSchoolId);
            response.status(201).json({ classId: record });
        } catch (error : any) {
            next(error);
        }
    }

    updateClass = async (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
        try {
            const classId = request.params.classId as string;
            const { newTeacher } = request.body;

            const userId = request.user!.userId as string;
            const userRole = request.user!.role as string;
            const userSchoolId = request.user!.schoolId as string;

            await this.classServices.updateClass(classId, newTeacher, userId, userRole, userSchoolId);
            response.status(200).json({ message: "Successfully update class" });
        } catch (error : any) {
            next(error);
        }
    }

    deleteClass = async (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
        try {
            const classId = request.params.classId as string;

            const userId = request.user!.userId as string;
            const userRole = request.user!.role as string;
            const userSchoolId = request.user!.schoolId as string;

            await this.classServices.deleteClass(classId, userId, userRole, userSchoolId);
            response.status(200).json({ message: "Successfully deleted class" });
        } catch (error : any) {
            next(error);
        }
    }

    getTeacherClasses = async (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
        try {
            const userId = request.user!.userId as string;
            const userSchoolId = request.user!.schoolId as string;

            const records = await this.classServices.getTeacherClasses(userId, userSchoolId);
            response.status(200).json({ teacherClasses: records });
        } catch (error : any) {
            next(error);
        }
    }

    getTeacherClassDetails = async (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
        try {
            const classId = request.params.classId as string;

            const userId = request.user!.userId as string;
            const userSchoolId = request.user!.schoolId as string;

            const records = await this.classServices.getTeacherClassDetails(classId, userId, userSchoolId);
            response.status(200).json({ teacherClass: records });
        } catch (error : any) {
            next(error);
        }
    }
}