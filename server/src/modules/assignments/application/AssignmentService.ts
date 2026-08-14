import type {AssignmentsOverview, UpdateAssignmentDTO} from "../domain/Assignment.types.js";
import type { IAssignmentRepository } from "../domain/IAssignmentRepository.js";
import { UnauthorizedError, ValidationError } from "../../errors/domain/CustomErrors.js";
import { assertValidDueDate } from "../domain/Assignment.rules.js";

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
        assertValidDueDate(assignmentDueAt);

        return this.assignmentRepository.createAssignment(assignmentName, assignmentDueAt, classId, assessmentId, userId, userRole, userSchoolId);
    }

    async updateAssignment(
        assignmentId: string,
        payload: UpdateAssignmentDTO,
        userId: string,
        userRole: string,
        userSchoolId: string): Promise<void> {
        if (!assignmentId) throw new ValidationError('los datos de la clase, criterio o asignación estan vacios');
        if (!userId || !userRole || !userSchoolId) throw new UnauthorizedError('los datos del usario master son invalidos');
        if (payload.assignmentName === undefined && payload.assignmentDueAt === undefined) {
            throw new ValidationError('Debe proporcionar al menos un campo para actualizar');
        }

        if (payload.assignmentDueAt) {
            assertValidDueDate(payload.assignmentDueAt);
        }

        return this.assignmentRepository.updateAssignment(assignmentId, payload, userId, userRole, userSchoolId);
    }

    async deleteAssignment(assignmentId: string, userId: string, userRole: string, userSchoolId: string): Promise<void> {
        if (!userId || !userRole || !userSchoolId) throw new UnauthorizedError('los datos del usario master son invalidos');
        if (!assignmentId) throw new ValidationError('El id de la asignación es invalido o esta vacio');

        return await this.assignmentRepository.deleteAssignment(assignmentId, userId, userRole, userSchoolId);
    }
}