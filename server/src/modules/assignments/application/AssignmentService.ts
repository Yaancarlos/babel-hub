import type { AssignmentsOverview } from "../domain/Assignment.types.js";
import type { IAssignmentRepository } from "../domain/IAssignmentRepository.js";
import { UnauthorizedError, ValidationError } from "../../errors/domain/CustomErrors.js";

export class AssignmentService {
    constructor(private readonly assignmentRepository: IAssignmentRepository) {}

    async getAssignmentsOverview(courseId: string, classId: string, userSchoolId: string): Promise<AssignmentsOverview> {
        if (!classId || !courseId) throw new ValidationError('Los datos del usario master son invalidos');

        return this.assignmentRepository.getAssignmentsOverview(courseId, classId, userSchoolId);
    }

    async createAssignment(
        assignmentName: string,
        assignmentDueAt: string,
        classId: string,
        assessmentId: string,
        userId: string,
        userRole: string,
        userSchoolId: string): Promise<void> {
        if (!classId || !assessmentId) throw new ValidationError('los datos de la clase y el criterio esta vacios');
        if (!assignmentName || !assignmentDueAt) throw new ValidationError('todos los campos obligatorios deben de estar llenos');
        if (!userId || !userRole || !userSchoolId) throw new UnauthorizedError('los datos del usario master son invalidos');

        const today = new Date().toISOString().slice(0, 10);
        if (assignmentDueAt < today) throw new ValidationError('no puedes colocar una fecha anterior al dia de hoy');

        return this.assignmentRepository.createAssignment(assignmentName, assignmentDueAt, classId, assessmentId, userId, userRole, userSchoolId);
    }
}