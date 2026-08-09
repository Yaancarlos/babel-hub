import type { AssignmentsOverview } from "../domain/Assignment.types.js";
import type { IAssignmentRepository } from "../domain/IAssignmentRepository.js";
import { ValidationError } from "../../errors/domain/CustomErrors.js";

export class AssignmentService {
    constructor(private readonly assigmentRepository: IAssignmentRepository) {}

    async getAssignmentsOverview(courseId: string, classId: string, userSchoolId: string): Promise<AssignmentsOverview> {
        if (!classId || !courseId) throw new ValidationError('Los datos del usario master son invalidos');

        return this.assigmentRepository.getAssignmentsOverview(courseId, classId, userSchoolId);
    }
}