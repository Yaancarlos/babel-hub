export interface AssignmentsOverview {
    students: {
        id: string;
        first_name: string;
        middle_name: string | null;
        first_last_name: string;
        second_last_name: string | null;
        email: string;
    }[];
    assessment_criteria: {
        id: string;
        name: string;
        weight: number;
        assignment_count: number;
    }[];
}