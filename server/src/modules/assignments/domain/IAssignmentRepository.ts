import type {AssignmentsOverview, UpdateAssignmentDTO} from "./Assignment.types.js";

export interface IAssignmentRepository {
    getAssignmentsOverview(courseId: string, classId: string, periodId: string, userSchoolId: string): Promise<AssignmentsOverview>;
    createAssignment(
        assignmentName: string,
        assignmentDueAt: string,
        classId: string,
        assessmentId: string,
        periodId: string,
        userId: string,
        userRole: string,
        userSchoolId: string): Promise<void>;
    updateAssignment(
        assignmentId: string,
        payload: UpdateAssignmentDTO,
        userId: string,
        userRole: string,
        userSchoolId: string
    ): Promise<void>;
    deleteAssignment(assignmentId: string, userId: string, userRole: string, userSchoolId: string): Promise<void>;
}