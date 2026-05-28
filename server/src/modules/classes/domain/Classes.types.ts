export interface Class {
    id: string;
    subject_id: string;
    teacher_id: string;
    course_id: string;
}

export interface ClassDetails {
    details: {
        id: string;
        course_id: string;
        course_name: string;
        subject_name: string;
        teacher_id: string;
        teacher_name: string;
        created_at: string;
    };
    students: {
        student_id: string;
        full_name: string;
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
    students: any[];
}