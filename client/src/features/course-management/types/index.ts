export type modeTypes = 'create' | 'edit';

export interface ClassItem {
    class_id: string;
    class_name: string;
    subject_name: string;
    teacher_name: string;
}

export interface Student {
    student_id: string;
    full_name: string;
    email: string;
}

export interface CoursesListData {
    id: string;
    course_name: string;
    created_at: string;
    year: string;
    director_id: string;
    director_name: string | null;
    student_count: string;
}

export interface CourseData {
    course: {
        id: string;
        name: string;
        created_at: string;
        year: string | number;
    };
    students: Student[];
    classes: ClassItem[];
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