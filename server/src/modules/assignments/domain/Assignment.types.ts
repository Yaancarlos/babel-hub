import type { GradeByAssignment } from "../../grade/domain/Grade.types.js";

export interface AssignmentsOverview {
    assessment_criteria: {
        id: string;
        name: string;
        weight: number;
        assignments: {
            id: string;
            name: string;
            due_date: string;
            created_at: string;
        }[];
    }[];
}

export interface AssignmentsStructure extends AssignmentsOverview {
    grades: GradeByAssignment[]
}

export interface UpdateAssignmentDTO {
    assignmentName?: string;
    assignmentDueAt?: string;
}