export interface Grades {
    id: string;
    student_id: string;
    assignment_id: string;
    value: number;
    comment: string | null;
}

export interface Scales {
    id: string;
    name: string;
    min_value: number;
    max_value: number;
    passing_value: number;
}

export interface Assignment {
    id: string;
    name: string;
    due_date: string;
    created_at: string;
    grades: Grades[];
}

export interface Student {
    student_id: string;
    first_name: string;
    middle_name: string | null;
    first_last_name: string;
    second_last_name: string | null;
    email: string;
}

export interface AssessmentCriteria {
    id: string;
    name: string;
    weight: number;
    assignments: Assignment[];
}

export interface AssignmentsOverview {
    assessment_criteria: AssessmentCriteria[];
    grades: Grades[];
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

export interface ClassDetailsData {
    details: CLassDetails;
    students:   Student[];
}

export interface GradeRecords {
    studentId: string;
    value: number;
    comment: string | null;
}