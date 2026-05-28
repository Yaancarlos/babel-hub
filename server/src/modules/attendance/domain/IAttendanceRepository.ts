import type {
    AttendanceSummary,
    CalendarAttendance,
    ClassAttendance, CourseAttendance,
    CourseDailyAttendance, BulkRecords
} from "./Attendance.types.js";


export interface IAttendanceRepository {
    getDailyClassAttendance(classId: string, schoolId: string, date:string): Promise<ClassAttendance[]>;
    getDailyCourseAttendance(courseId: string, schoolId: string, date: string): Promise<CourseDailyAttendance[]>;
    bulkUpsertAttendance(classId: string, records: BulkRecords[], date: string, userId: string, userRole: string, userSchoolId: string): Promise<void>
    getAttendanceSummary(schoolId: string, startDate: string, endDate: string): Promise<AttendanceSummary[]>
    getCalendarAttendance(studentId: string, startDate: string, endDate: string): Promise<CalendarAttendance[]>;
    getClassAttendance(courseId: string, classId: string, startDate: string, endDate: string): Promise<CourseAttendance[]>;
}