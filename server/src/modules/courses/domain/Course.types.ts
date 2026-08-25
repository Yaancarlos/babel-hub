export interface Courses {
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

export interface CourseDetails {
    course: {
        is_active: boolean;
        id: string;
        name: string;
        year: string;
        created_at: string;
    };
    students: {
        is_active: boolean;
        student_id: string;
        first_name: string;
        middle_name: string | null;
        first_last_name: string;
        second_last_name: string | null;
        email: string;
    }[];
    classes: {
        is_active: boolean;
        class_id: string;
        subject_name: string;
        first_name: string;
        middle_name: string | null;
        first_last_name: string;
        second_last_name: string | null;
    }[];
}

export interface TeacherCourse {
    id: string;
    name: string;
    total_students: number;
}

export interface CreateCourse {
    id: string;
}

export interface UpdateCourse {
    id: string;
    name: string;
}
