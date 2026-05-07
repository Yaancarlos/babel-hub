export interface Assignment {
    id: string;
    title: string;
    type: string;
    due_date: string;
}

export interface Student {
    student_id: string;
    full_name: string;
    email: string;
}

export interface ClassDetailsData {
    details: {
        id: string;
        class_name: string;
        course_name: string;
        subject_name: string;
        teacher_name: string;
    };
    students: Student[];
    assignments: Assignment[];
}