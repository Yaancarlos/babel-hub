export interface StudentProps {
    student_id: string;
    enrollment_code: string;
    full_name: string;
    created_at: string;
    course_name: string;
    course_id?: string;
    email: string;
}

export interface StudentRowProps {
    student: StudentProps;
    onEdit: (student: StudentProps) => void;
    onDelete: (id: string) => void;
    onNavigate: (id: string) => void;
}

export interface CreateStudent {
    fullName: string;
    email: string;
    password: string;
    enrolmentCode: string;
    courseId: string
}

export interface UpdateStudent {
    fullName: string;
    enrolmentCode: string;
    courseId: string
}

export interface Teacher {
    id: string;
    user_id: string;
    created_at: string;
    full_name: string;
    email: string;
    total_classes: number;
}
export interface TeacherRowProps {
    teacher: Teacher;
    onEdit: (teacher: Teacher) => void;
    onDelete: (id: string) => void;
    onNavigate: (id: string) => void;
}

export interface CreateTeacher {
    fullName: string;
    email: string;
    password: string;
}

export interface UpdateTeacher {
    fullName: string;
}

export interface ClassItem {
    class_id: string;
    subject_name: string;
    course_name: string;
}

export interface GradeRecord {
    assignment_id: string;
    assignment_title: string;
    class_name: string;
    grade_value: number;
    graded_at: string;
}