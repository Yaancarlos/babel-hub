export interface StudentProps {
    course_id: string;
    course_name: string;
    student_id: string;
    student_first_name: string;
    student_middle_name: string | null;
    student_first_last_name: string;
    student_second_last_name: string | null;
    email: string;
    is_active: boolean;
    enrollment_code: string | null;
    created_at: string;
}

export interface StudentRowProps {
    student: StudentProps;
    onEdit: (student: StudentProps) => void;
    onDelete: (id: string) => void;
    onNavigate: (id: string) => void;
}

export interface CreateStudent {
    firstName: string;
    middleName: string;
    firstLastName: string;
    secondLastName: string;
    email: string;
    password: string;
    enrollmentCode: string;
    courseId: string
}

export interface UpdateStudent {
    firstName: string;
    middleName: string;
    firstLastName: string;
    secondLastName: string;
    enrollmentCode: string;
    courseId: string
}

export interface Teacher {
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
export interface TeacherRowProps {
    teacher: Teacher;
    onEdit: (teacher: Teacher) => void;
    onDelete: (id: string) => void;
    onNavigate: (id: string) => void;
}

export interface CreateTeacher {
    firstName: string;
    middleName: string;
    firstLastName: string;
    secondLastName: string;
    email: string;
    password: string;
}

export interface UpdateTeacher {
    firstName: string;
    middleName: string;
    firstLastName: string;
    secondLastName: string;
}

export interface TeacherItem {
    teacher_id: string;
    teacher_first_name: string;
    teacher_middle_name: string | null;
    teacher_first_last_name: string;
    teacher_second_last_name: string | null;
    email: string;
    is_active: boolean;
    created_at: string;
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