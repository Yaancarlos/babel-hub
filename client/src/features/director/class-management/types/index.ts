export interface Assignment {
    id: string;
    title: string;
    type: string;
    due_date: string;
}

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

interface CLassDetails {
    id: string;
    course_id: string;
    course_name: string;
    subject_name: string;
    teacher_id: string;
    teacher_first_name: string;
    teacher_middle_name: string | null;
    teacher_first_last_name: string;
    teacher_second_last_name: string | null;
    created_at: string;
}

export interface Student {
    student_id: string;
    first_name: string;
    middle_name: string | null;
    first_last_name: string;
    second_last_name: string | null;
    email: string;
}

export interface ClassDetailsData {
    details: CLassDetails;
    students:   Student[];
    assignments: Assignment[];
}