export interface ClassDetails {
    details: {
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
    };
    students: {
        student_id: string;
        first_name: string;
        middle_name: string | null;
        first_last_name: string;
        second_last_name: string | null;
        email: string;
    }[];
    assignments: any[];
}

export interface CreateClass {
    id: string;
}

export interface TeacherClasses {
    class_id: string;
    subject_name: string;
    course_id: string;
    course_name: string;
    total_students: number;
}

export interface TeacherClassDetails {
    course_id: string;
    course_name: string;
    subject_name: string;
    total_students: number;
    students: {
        student_id: string;
        student_first_name: string;
        student_middle_name: string | null;
        student_first_last_name: string;
        student_second_last_name: string | null;
    }[];
}