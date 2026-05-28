export interface Course {
    id: string;
    name: string;
    teacher_id: string;
    school_id: string;
    
}

export interface Courses {
    id: string;
    course_name: string;
    created_at: string;
    year: number;
    director_id: number;
    director_name: string;
    student_count: number;
}

export interface CourseDetails {
    course: {
        id: string;
        name: string;
        created_at: string;
        year: string;
    };
    students: {
        student_id: string;
        full_name: string;
        email: string;
    }[];
    classes: {
        class_id: string;
        subject_name: string;
        teacher_name: string;
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
