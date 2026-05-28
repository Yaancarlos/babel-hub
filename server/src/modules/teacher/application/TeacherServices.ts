import type { ITeacherRepository } from "../domain/ITeacherRepository.js";
import type { CreateTeacher, TeacherDetails, Teachers } from "../domain/Teacher.types.js";
import { NotFoundError, UnauthorizedError, ValidationError } from "../../errors/domain/CustomErrors.js";

export class TeacherServices {
    constructor( private readonly teacherServices : ITeacherRepository ) {}

    async getTeachers(userSchoolId: string, available: string | undefined, includeTeacherId: string | undefined): Promise<Teachers[]> {
        return await this.teacherServices.getTeachers(userSchoolId, available, includeTeacherId);
    }

    async getTeacherDetails(teacherId: string, userSchoolId: string): Promise<TeacherDetails> {
        if (!userSchoolId) throw new UnauthorizedError("Faltan credenciales del usuario (master)");
        if (!teacherId) throw new ValidationError("El ID de maestro es obligatorio");

        const teacher = await this.teacherServices.getTeacherDetails(teacherId, userSchoolId);
        if (!teacher) throw new NotFoundError("No se encontro el maestro");

        return teacher;
    }

    async createTeacher(teacherName: string, teacherPassword: string, teacherEmail: string, userId: string, userRole: string, userSchoolId: string): Promise<CreateTeacher> {
        if (!userId || !userRole || !userSchoolId) throw new UnauthorizedError("Faltan credenciales del usuario (master)");
        if (!teacherName || !teacherPassword || !teacherEmail) throw new ValidationError("Faltan campos obligatorios");

        return await this.teacherServices.createTeacher(teacherName, teacherPassword, teacherEmail, userId, userRole, userSchoolId);
    }

    async updateTeacher(teacherId: string, teacherName: string, userId: string, userRole: string, userSchoolId: string): Promise<void> {
        if (!userId || !userRole || !userSchoolId) throw new UnauthorizedError("Faltan credenciales del usuario (master)");
        if (!teacherName) throw new ValidationError("Faltan campos obligatorios");
        if (!teacherId) throw new ValidationError("El ID del maestro es obligatorio");

        return await this.teacherServices.updateTeacher(teacherId, teacherName, userId, userRole, userSchoolId);
    }

    async deleteTeacher(teacherId: string, userId: string, userRole: string, userSchoolId: string): Promise<void> {
        if (!userId || !userRole || !userSchoolId) throw new UnauthorizedError("Faltan credenciales del usuario (master)");
        if (!teacherId) throw new ValidationError("El ID del maestro es obligatorio");

        return await this.teacherServices.deleteTeacher(teacherId, userId, userRole, userSchoolId);
    }

}