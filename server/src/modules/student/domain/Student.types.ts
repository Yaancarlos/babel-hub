export interface Students {
    course_id: string;
    course_name: string;
    student_id: string;
    full_name: string;
    email: string;
    enrollment_code: string;
    created_at: string;
}

export interface StudentDetails {
    id: string;
    full_name: string;
    email: string;
    enrollment_code: string;
    course_name: string;
    recent_grades: any[];
}

export interface CreateStudent {
    id: string;
}