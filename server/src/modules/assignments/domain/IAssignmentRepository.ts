import type { AssignmentsOverview } from "./Assignment.types.js";

export interface IAssignmentRepository {
    getAssignmentsOverview(courseId: string, classId: string, userSchoolId: string): Promise<AssignmentsOverview>;
}