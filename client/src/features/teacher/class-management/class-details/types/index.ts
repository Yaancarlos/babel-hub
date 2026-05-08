export interface Student {
    student_id: string;
    student_name: string;
}

export interface ClassDetailsData {
    subject_name: string;
    course_id: string;
    course_name: string;
    total_students: number;
    students: Student[];
}

export interface Assignment {
    id: string;
    title: string;
    type: string;
    due_date: string;
}