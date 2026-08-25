export interface TeacherCourse {
    id: string;
    name: string;
    total_students: string | number;
}

export interface TeacherClasses {
    class_id: string;
    subject_name: string;
    course_id: string;
    course_name: string;
    total_students: number;
}