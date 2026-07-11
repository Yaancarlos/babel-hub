export interface Students {
    course_id: string;
    course_name: string;
    student_id: string;
    student_first_name: string;
    student_middle_name: string | null;
    student_first_last_name: string;
    student_second_last_name: string | null;
    email: string;
    enrollment_code: string | null;
    created_at: string;
}

export interface StudentDetails {
    id: string;
    student_first_name: string;
    student_middle_name: string | null;
    student_first_last_name: string;
    student_second_last_name: string | null;
    email: string;
    enrollment_code: string | null;
    course_name: string;
    recent_grades: any[];
}

export interface CreateStudent {
    id: string;
}