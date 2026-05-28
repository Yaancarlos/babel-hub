import type { ISubjectsRepository } from "../domain/ISubjectsRepository.js";
import type { AvailableSubjects, CreateSubject, SubjectDetails} from "../domain/Subjects.types.js";
import { UnauthorizedError, ValidationError } from "../../errors/domain/CustomErrors.js";

export class SubjectServices {
    constructor(private readonly subjectRepository : ISubjectsRepository) {}

    async getSubjectsByArea(subjectAreaId: string, userSchoolId: string): Promise<SubjectDetails[]> {
        if (!userSchoolId) throw new UnauthorizedError("Faltan credenciales del usuario (master)");
        if (!subjectAreaId) throw new ValidationError("Faltan campos obligatorios");

        return await this.subjectRepository.getSubjectsByArea(subjectAreaId, userSchoolId);
    }

    async getAvailableSubjects(courseId: string, userSchoolId: string): Promise<AvailableSubjects[]> {
        if (!userSchoolId) throw new UnauthorizedError("Faltan credenciales del usuario (master)");
        if (!courseId) throw new ValidationError("El ID del curso es obligatorio");

        return this.subjectRepository.getAvailableSubjects(courseId, userSchoolId);
    }

    async createSubject(subjectName: string, subjectAreaId: string, userId: string, userRole: string, userSchoolId: string): Promise<CreateSubject> {
        if (!userId || !userRole || !userSchoolId) throw new UnauthorizedError("Faltan credenciales del usuario (master)");
        if (!subjectName || !subjectAreaId) throw new ValidationError("Faltan campos obligatorios");

        return await this.subjectRepository.createSubject(subjectName, subjectAreaId, userId, userRole, userSchoolId);
    }

    async updateSubject(subjectId: string, subjectName: string, subjectAreaId: string, userId: string, userRole: string, userSchoolId: string): Promise<void> {
        if (!subjectId) throw new ValidationError("El ID de la asignatura es obligatorio");
        if (!userId || !userRole || !userSchoolId) throw new UnauthorizedError("Faltan credenciales del usuario (master)");
        if (!subjectName || !subjectAreaId) throw new ValidationError("Faltan campos obligatorios");

        return await this.subjectRepository.updateSubject(subjectId, subjectName, subjectAreaId, userId, userRole, userSchoolId);
    }

    async deleteSubject(subjectId: string, userId: string, userRole: string, userSchoolId: string): Promise<void> {
        if (!userId || !userRole || !userSchoolId) throw new UnauthorizedError("Faltan credenciales del usuario (master)");
        if (!subjectId) throw new ValidationError("El ID de la asignatura es obligatorio");

        return await this.subjectRepository.deleteSubject(subjectId, userId, userRole, userSchoolId);
    }
}