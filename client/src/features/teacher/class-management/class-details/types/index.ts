import type { AttendanceStatus } from "../../../../types/types.ts";


export interface Student {
    student_id: string;
    first_name: string;
    middle_name: string | null;
    first_last_name: string;
    second_last_name: string | null;
    email: string;
}

export interface ClassDetailsData {
    course_id: string;
    course_name: string;
    subject_name: string;
    total_students: number;
    students: Student[];
}

export interface ClassAttendance {
    student_id: string;
    first_name: string;
    middle_name: string | null;
    first_last_name: string;
    second_last_name: string | null;
    status: AttendanceStatus;
    date: string | null;
}

interface AttendanceRecord {
    date: string;
    status: AttendanceStatus;
}

export interface CourseAttendance {
    student_id: string;
    student_first_name: string;
    student_middle_name: string | null;
    student_first_last_name: string;
    student_second_last_name: string | null;
    date: string;
    status: AttendanceStatus;
}

export interface StudentPeriodAttendance {
    student_id: string;
    firstName: string;
    middleName: string | null;
    firstLastName: string;
    secondLastName: string | null;
    records: AttendanceRecord[];
}

export interface GradeRecords {
    studentId: string;
    value: number;
    comment: string | null;
}

export interface Grades {
    id: string;
    student_id: string;
    assignment_id: string;
    value: number;
    comment: string | null;
}

export interface Assignment {
    id: string;
    name: string;
    due_date: string;
    created_at: string;
    grades: Grades[];
}

export interface AssessmentCriteria {
    id: string;
    name: string;
    weight: number;
    assignments: Assignment[];
}