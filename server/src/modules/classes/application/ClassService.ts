import type { IClassRepository } from "../domain/IClassRepository.js";
import { NotFoundError, UnauthorizedError, ValidationError } from "../../errors/domain/CustomErrors.js";
import type { ClassDetails } from "../domain/Classes.types.js";

export class ClassService {
    constructor( private readonly classRepository : IClassRepository ) {};

    async getClassDetails(classId: string, schoolId: string, isActive: boolean): Promise<ClassDetails> {
        if (!classId) throw new ValidationError("El ID de la clase es obligatorio");
        if (!schoolId) throw new UnauthorizedError("Falta el ID del colegio");

        const classDetails = await this.classRepository.getClassDetails(classId, schoolId, isActive);

        if (!classDetails) {
            throw new NotFoundError("La clase no existe o no tienes acceso");
        }

        return classDetails;
    }

    async createClass(courseId: string, subjectId: string, teacherId: string, userId: string, userRole: string, userSchoolId: string) {
        if (!courseId || !subjectId || !teacherId) {
            throw new ValidationError("Faltan parámetros obligatorios (Curso, Materia o Profesor)");
        }
        if (!userId || !userRole || !userSchoolId) {
            throw new UnauthorizedError("Credenciales de usuario inválidas");
        }

        return await this.classRepository.createClass(courseId, subjectId, teacherId, userId, userRole, userSchoolId);
    }

    async updateClass(classId: string, teacherId: string, userId: string, userRole: string, userSchoolId: string) {
        if (!classId || !teacherId) {
            throw new ValidationError("El ID de la clase y el nuevo profesor son obligatorios");
        }
        if (!userId || !userRole || !userSchoolId) {
            throw new UnauthorizedError("Credenciales de usuario inválidas");
        }

        return await this.classRepository.updateClass(classId, teacherId, userId, userRole, userSchoolId);
    }

    async deleteClass(classId: string, userId: string, userRole: string, userSchoolId: string) {
        if (!classId) throw new ValidationError("El ID de la clase es obligatorio");
        if (!userId || !userRole || !userSchoolId) throw new UnauthorizedError("Credenciales de usuario inválidas");

        return await this.classRepository.deleteClass(classId, userId, userRole, userSchoolId);
    }

    async getTeacherClasses(teacherId: string, teacherSchoolId: string) {
        if (!teacherId) throw new ValidationError("El ID del profesor es obligatorio");
        if (!teacherSchoolId) throw new UnauthorizedError("Falta el ID del colegio");

        return await this.classRepository.getTeacherClasses(teacherId, teacherSchoolId);
    }

    async getTeacherClassDetails(classId: string, teacherId: string, teacherSchoolId: string) {
        if (!classId) throw new ValidationError("El ID de la clase es obligatorio");
        if (!teacherId || !teacherSchoolId) throw new UnauthorizedError("Credenciales de usuario inválidas");

        const details = await this.classRepository.getTeacherClassDetails(classId, teacherId, teacherSchoolId);

        if (!details) {
            throw new NotFoundError("La clase no existe o no le pertenece");
        }

        return details;
    }
}