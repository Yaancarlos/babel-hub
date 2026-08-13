import type { AssignmentsOverview } from "./Assignment.types.js";

export interface IAssignmentRepository {
    getAssignmentsOverview(courseId: string, classId: string, userSchoolId: string): Promise<AssignmentsOverview>;
    createAssignment(
        assignmentName: string,
        assignmentDueAt: string,
        classId: string,
        assessmentId: string,
        userId: string,
        userRole: string,
        userSchoolId: string): Promise<void>;
    updateAssignment(
        assignmentId: string,
        assignmentName: string,
        assignmentDueAt: string,
        userId: string,
        userRole: string,
        userSchoolId: string
    ): Promise<void>;
    deleteAssignment(assignmentId: string, userId: string, userRole: string, userSchoolId: string): Promise<void>;
}