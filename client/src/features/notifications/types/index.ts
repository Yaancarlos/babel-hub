export interface AttendanceSummary {
    course_id: string;
    course_name: string;
    student_id: string;
    student_name: string;
    total_absences: number;
    total_lates: number;
}

export interface Period {
    id: string;
    name: string;
    start_date: string;
    end_date: string;
}