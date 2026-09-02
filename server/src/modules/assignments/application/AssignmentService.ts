import type {AssignmentsOverview, AssignmentsStructure, UpdateAssignmentDTO} from "../domain/Assignment.types.js";
import type { IAssignmentRepository } from "../domain/IAssignmentRepository.js";
import { UnauthorizedError, ValidationError } from "../../errors/domain/CustomErrors.js";
import { assertValidDueDate } from "../domain/Assignment.rules.js";

// From Grade Module
import type { IGradeRepository } from "../../grade/domain/IGradeRepository.js";

export class AssignmentService {
    constructor(
        private readonly assignmentRepository: IAssignmentRepository,
        private readonly gradeRepository: IGradeRepository
    ) {}
    async getAssignmentsOverview(courseId: string, classId: string, periodId: string, userSchoolId: string): Promise<AssignmentsStructure> {
        if (!classId || !courseId || !periodId) throw new ValidationError('Los datos son inválidos');

        const [overview, grades] = await Promise.all([
            this.assignmentRepository.getAssignmentsOverview(courseId, classId, periodId, userSchoolId),
            this.gradeRepository.getGradesByClass(classId)
        ]);

        return { ...overview, grades };
    }

    async createAssignment(
        assignmentName: string,
        assignmentDueAt: string,
        classId: string,
        assessmentId: string,
        periodId: string,
        userId: string,
        userRole: string,
        userSchoolId: string): Promise<void> {
        if (!classId || !assessmentId || !periodId) throw new ValidationError('los datos de la clase, el criterio o el periodo estan vacios');
        if (!assignmentName || !assignmentDueAt) throw new ValidationError('todos los campos obligatorios deben de estar llenos');
        if (!userId || !userRole || !userSchoolId) throw new UnauthorizedError('los datos del usario master son invalidos');
        assertValidDueDate(assignmentDueAt);

        return this.assignmentRepository.createAssignment(assignmentName, assignmentDueAt, classId, assessmentId, periodId, userId, userRole, userSchoolId);
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