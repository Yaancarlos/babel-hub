export interface TeacherCourse {
    id: string;
    name: string;
    total_students: string | number;
}

export interface TeacherClass {
    class_id: string;
    subject_name: string;
    course_name: string;
    course_id: string;
    total_students: number;
}