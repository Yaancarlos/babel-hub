export interface Attendance {
    id: string;
    student_id: string;
    class_id: string;
    date: string;
    status: 'absent' | 'late' | 'present';
}

export interface ClassAttendance {
    student_id: string;
    full_name: string;
    status: 'absent' | 'late' | 'present' | 'no_data';
    date: string;
}

export interface CourseDailyAttendance {
    student_id: string;
    daily_status: 'absent' | 'late' | 'present' | 'no_data';
}

export interface AttendanceSummary {
    course_id: string;
    course_name: string;
    student_id: string;
    student_name: string;
    total_absences: number;
    total_lates: number;
}

export interface CalendarAttendance {
    date: string;
    daily_status: 'absent' | 'late' | 'present' | 'no_data'
}

export interface CourseAttendance {
    student_id: string;
    name: string;
    date: string;
    status: 'absent' | 'late' | 'present' | 'no_data';
}

export interface BulkRecords {
    studentId: string,
    status: string
}