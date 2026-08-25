import type { CourseService } from "../application/CourseService.js";
import type { AuthenticatedRequest } from "../../../middleware/auth.middleware.js";
import type { Response, NextFunction } from 'express'

export class CourseController {
    constructor( private readonly courseService: CourseService ) {}

    getCourses = async (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
        try {
            const schoolId = request.user!.schoolId as string;
            const isActive = true;

            const records = await this.courseService.getCourses(schoolId, isActive);
            response.status(200).json({ courses: records })
        } catch (error : any) {
            next(error);
        }
    }

    getCourseDetails = async (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
        try {
            const id = request.params.id as string;
            const schoolId = request.user!.schoolId as string;
            const isActive = true;

            const { course, students, classes } = await this.courseService.getCourseDetails(id, schoolId, isActive);
            response.status(200).json({ course, students, classes })
        } catch (error : any) {
            next(error);
        }
    }

    createCourse = async (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
        try {
            const { name, year, teacherId } = request.body;

            const userSchoolId = request.user!.schoolId as string;
            const userRole = request.user!.role as string;
            const userId = request.user!.userId as string;

            const record = await this.courseService.createCourse(name, year, teacherId, userId, userRole, userSchoolId);
            response.status(201).json({ record })
        } catch (error : any) {
            next(error);
        }
    }

    updateCourse = async (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
        try {
            const id = request.params.id as string;
            const { name, year, teacherId } = request.body;

            const userSchoolId = request.user!.schoolId as string;
            const userRole = request.user!.role as string;
            const userId = request.user!.userId as string;

            const record = await this.courseService.updateCourse(id, name, year, teacherId, userId, userRole, userSchoolId);
            response.status(200).json({ record })
        } catch (error : any) {
            next(error);
        }
    }

    deleteCourse = async (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
        try {
            const id = request.params.id as string;

            const userId = request.user!.userId as string;
            const userSchoolId = request.user!.schoolId as string;
            const userRole = request.user!.role as string;

            await this.courseService.deleteCourse(id, userId, userRole, userSchoolId);
            response.status(204).send();
        } catch (error : any) {
            next(error);
        }
    }

    getTeacherCourse = async (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
        try {
            const userId = request.user!.userId as string;
            const userSchoolId = request.user!.schoolId as string;

            const record = await this.courseService.getTeacherCourse(userId, userSchoolId);
            response.status(200).json({ teacherCourse: record });
        } catch (error : any) {
            next(error);
        }
    }
}