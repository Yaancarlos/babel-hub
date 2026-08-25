export interface ClassAttendance {
    student_id: string;
    first_name: string;
    middle_name: string | null;
    first_last_name: string;
    second_last_name: string | null;
    status: 'absent' | 'late' | 'present' | 'excused' | null;
    date: string | null;
}

export interface CourseDailyAttendance {
    student_id: string;
    daily_status: 'absent' | 'late' | 'present' | 'excused' | 'no_data';
}

export interface AttendanceSummary {
    course_id: string;
    course_name: string;
    student_id: string;
    student_first_name: string;
    student_middle_name: string | null;
    student_first_last_name: string;
    student_second_last_name: string | null;
    total_absences: number;
    total_lates: number;
}

export interface CalendarAttendance {
    date: string;
    daily_status: 'absent' | 'late' | 'present' | 'excused' | 'no_data'
}

export interface CourseAttendance {
    student_id: string;
    student_first_name: string;
    student_middle_name: string | null;
    student_first_last_name: string;
    student_second_last_name: string | null;
    date: string;
    status: 'absent' | 'late' | 'present' | 'excused' | 'no_data';
}

export interface BulkRecords {
    studentId: string,
    status: string
}