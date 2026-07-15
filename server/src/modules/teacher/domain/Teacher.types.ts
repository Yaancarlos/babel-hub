export interface Teachers {
    id: string;
    teacher_first_name: string;
    teacher_middle_name: string | null;
    teacher_first_last_name: string;
    teacher_second_last_name: string | null;
    is_active: boolean;
    email: string;
    created_at: string;
    total_classes: number;
}

export interface TeacherRow {
    teacher_id: string;
    teacher_first_name: string;
    teacher_middle_name: string | null;
    teacher_first_last_name: string;
    teacher_second_last_name: string | null;
    email: string;
    is_active: boolean;
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