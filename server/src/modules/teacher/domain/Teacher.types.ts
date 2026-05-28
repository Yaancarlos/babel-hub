export interface Teachers {
    id: string;
    full_name: string;
    email: string;
    created_at: string;
    total_classes: number;
}

export interface TeacherRow {
    teacher_id: string;
    full_name: string;
    email: string;
    created_at: string;
}

export interface ClassRow {
    class_id: string;
    subject_name: string;
    course_name: string;
}

export interface TeacherDetails {
    teacher: TeacherRow;
    classes: ClassRow[];
}

export interface CreateTeacher {
    id: string;
}