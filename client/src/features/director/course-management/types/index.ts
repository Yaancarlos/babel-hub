export interface ClassItem {
    is_active: boolean;
    class_id: string;
    subject_name: string;
    first_name: string;
    middle_name: string | null;
    first_last_name: string;
    second_last_name: string | null;
}

export interface Student {
    is_active: boolean;
    student_id: string;
    first_name: string;
    middle_name: string | null;
    first_last_name: string;
    second_last_name: string | null;
    email: string;
}

export interface CoursesListData {
    id: string;
    course_name: string;
    created_at: string;
    year: string;
    is_active: boolean;
    director_id: string;
    director_first_name: string;
    director_middle_name: string | null;
    director_first_last_name: string;
    director_second_last_name: string | null;
    student_count: number;
}

export interface UpsertCourse {
    name: string;
    year: string;
    teacherId: string;
}

export interface CreateClass {
    courseId: string;
    subjectId: string;
    teacherId: string;
}

export interface UpdateClass {
    teacherId: string;
}