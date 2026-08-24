import type { ITeacherRepository } from "../domain/ITeacherRepository.js";
import type { CreateTeacher, TeacherDetails, Teachers } from "../domain/Teacher.types.js";
import { NotFoundError, UnauthorizedError, ValidationError } from "../../errors/domain/CustomErrors.js";

export class TeacherServices {
    constructor( private readonly teacherRepository : ITeacherRepository ) {}

    async getTeachers(userSchoolId: string, available: string | undefined, includeTeacherId: string | undefined, isActive: boolean): Promise<Teachers[]> {
        return await this.teacherRepository.getTeachers(userSchoolId, available, includeTeacherId, isActive);
    }

    async getTeacherDetails(teacherId: string, userSchoolId: string): Promise<TeacherDetails> {
        if (!userSchoolId) throw new UnauthorizedError("Faltan credenciales del usuario (master)");
        if (!teacherId) throw new ValidationError("El ID de maestro es obligatorio");

        const teacher = await this.teacherRepository.getTeacherDetails(teacherId, userSchoolId);
        if (!teacher) throw new NotFoundError("No se encontro el maestro");

        return teacher;
    }

    async createTeacher(teacherFirstName: string,
                        teacherMiddleName: string | null | undefined,
                        teacherFirstLastName: string,
                        teacherSecondLastName: string | null | undefined,
                        teacherPassword: string,
                        teacherEmail: string,
                        userId: string,
                        userRole: string,
                        userSchoolId: string): Promise<CreateTeacher> {
        if (!userId || !userRole || !userSchoolId) throw new UnauthorizedError("Faltan credenciales del usuario (master)");
        if (!teacherFirstName ||
            !teacherFirstLastName ||
            !teacherPassword ||
            !teacherEmail) throw new ValidationError("Faltan campos obligatorios del formulario");

        return await this.teacherRepository.createTeacher(
            teacherFirstName,
            teacherMiddleName ?? null,
            teacherFirstLastName,
            teacherSecondLastName ?? null,
            teacherPassword,
            teacherEmail,
            userId,
            userRole,
            userSchoolId);
    }

    async updateTeacher(teacherId: string,
                        teacherFirstName: string,
                        teacherMiddleName: string | null | undefined,
                        teacherFirstLastName: string,
                        teacherSecondLastName: string | null | undefined,
                        userId: string,
                        userRole: string,
                        userSchoolId: string): Promise<void> {
        if (!userId || !userRole || !userSchoolId) throw new UnauthorizedError("Faltan credenciales del usuario (master)");
        if (!teacherFirstName || !teacherFirstLastName) throw new ValidationError("Faltan campos obligatorios");
        if (!teacherId) throw new ValidationError("El ID del maestro es obligatorio");

        return await this.teacherRepository.updateTeacher(
            teacherId,
            teacherFirstName,
            teacherMiddleName ?? null,
            teacherFirstLastName,
            teacherSecondLastName ?? null,
            userId,
            userRole,
            userSchoolId);
    }

    async deleteTeacher(teacherId: string, userId: string, userRole: string, userSchoolId: string): Promise<void> {
        if (!userId || !userRole || !userSchoolId) throw new UnauthorizedError("Faltan credenciales del usuario (master)");
        if (!teacherId) throw new ValidationError("El ID del maestro es obligatorio");

        return await this.teacherRepository.deleteTeacher(teacherId, userId, userRole, userSchoolId);
    }

}