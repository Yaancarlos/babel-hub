import type { ClassAttendance, CourseDailyAttendance, BulkRecords, AttendanceSummary, CalendarAttendance, CourseAttendance } from "../domain/Attendance.types.js";
import type { IAttendanceRepository } from "../domain/IAttendanceRepository.js";
import { pool } from "../../../db/index.js";
import { createAuditLog } from "../../../services/audit.service.js";
import { NotFoundError } from "../../errors/domain/CustomErrors.js";

export class PostgresAttendanceRepository implements IAttendanceRepository {
    async getDailyClassAttendance(classId: string, schoolId: string, date: string): Promise<ClassAttendance[]> {
        const client = await pool.connect();
        try {
            const result = await client.query(`
                SELECT 
                    s.id as student_id,
                    u.full_name,
                    a.status,
                    a.date
                FROM classes c
                JOIN students s ON s.course_id = c.course_id
                JOIN users u ON s.user_id = u.id
                LEFT JOIN attendance a ON a.student_id = s.id AND a.class_id = $1 AND a.date = $2
                WHERE c.id = $1 AND u.school_id = $3
                ORDER BY u.full_name ASC;
            `, [classId, date, schoolId]);

            return result.rows;
        } finally {
            client.release();
        }
    }
    async getDailyCourseAttendance(courseId: string, schoolId: string, date: string): Promise<CourseDailyAttendance[]> {
        const client = await pool.connect();
        try {
            const result = await client.query(`
                SELECT 
                    s.id as student_id,
                    CASE 
                        WHEN bool_or(a.status = 'present') THEN 'present'
                        WHEN bool_or(a.status = 'late') THEN 'late'
                        WHEN bool_or(a.status = 'absent') THEN 'absent'
                        ELSE 'no_data'
                    END as daily_status
                FROM students s
                JOIN users u ON s.user_id = u.id
                LEFT JOIN classes c ON c.course_id = s.course_id
                LEFT JOIN attendance a ON a.student_id = s.id AND a.class_id = c.id AND a.date = $1
                WHERE s.course_id = $2 AND u.school_id = $3
                GROUP BY s.id
            `, [date, courseId, schoolId]);

            return result.rows;
        } finally {
            client.release()
        }

    }
    async bulkUpsertAttendance(classId: string, records: BulkRecords[], date: string, userId: string, userRole: string, userSchoolId: string): Promise<void> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const classCheck = await client.query(`
                SELECT c.id FROM classes c
                                     JOIN courses co ON c.course_id = co.id
                WHERE c.id = $1 AND co.school_id = $2
            `, [classId, userSchoolId]);

            if (classCheck.rowCount === 0) {
                throw new NotFoundError("No fue posible guardar la asistencia");
            }

            // Postgres Test

            const studentIds: string[] = records.map(r => r.studentId);
            const statuses: string[] = records.map(r => r.status);

            await client.query(`
                INSERT INTO attendance (student_id, class_id, date, status)
                SELECT unnest($1::uuid[]), $2, $3, unnest($4::text[])
                ON CONFLICT (student_id, class_id, date) 
                DO UPDATE SET
                    status = EXCLUDED.status,
                    updated_at = NOW();
            `, [studentIds, classId, date, statuses]);

            await createAuditLog(client, {
                actorUserId: userId,
                actorRole: userRole,
                action: "TAKE_CLASS_ATTENDANCE",
                schoolId: userSchoolId,
                metadata: { classId, date, studentCount: records.length }
            });

            await client.query('COMMIT');
            return;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }


    async getAttendanceSummary(schoolId: string, startDate: string, endDate: string): Promise<AttendanceSummary[]> {
        const client = await pool.connect();
        try {
            const result = await client.query(`
            WITH LastRecord AS (
                    SELECT
                        student_id,
                        MAX(date) as last_record
                    FROM attendance
                    WHERE date >= $1 AND date <= $2
                    GROUP BY student_id
                ), CheckLastStatus AS (
                        SELECT 
                            a.student_id
                        FROM attendance a
                        JOIN LastRecord lr ON a.student_id = lr.student_id AND a.date = lr.last_record
                        GROUP BY a.student_id
                        HAVING BOOL_OR(a.status IN ('absent', 'late'))
                            AND NOT BOOL_OR(a.status = 'present')
                )
                SELECT
                    c.id as course_id,
                    c.name as course_name,
                    s.id as student_id,
                    u.full_name as student_name,
                    COUNT(DISTINCT a.date) FILTER (WHERE a.status = 'absent') AS total_absences,
                    COUNT(s.id) FILTER (WHERE a.status = 'late') AS total_lates
                FROM CheckLastStatus cls
                JOIN students s ON cls.student_id = s.id
                JOIN users u ON s.user_id = u.id
                JOIN courses c ON s.course_id = c.id
                JOIN attendance a ON s.id = a.student_id 
                WHERE u.school_id = $3
                AND a.date >= $1 AND a.date <= $2
                GROUP BY
                    c.id,
                    c.name,
                    s.id,
                    u.full_name
                HAVING COUNT(DISTINCT a.date) FILTER (WHERE a.status = 'absent') > 0
                    OR COUNT(s.id) FILTER (WHERE a.status = 'late') > 0
                ORDER BY c.name::integer DESC, total_absences DESC, u.full_name ASC;
            `, [startDate, endDate, schoolId]);

            return result.rows;
        } finally {
            client.release()
        }
    }
    async getCalendarAttendance(studentId: string, startDate: string, endDate: string): Promise<CalendarAttendance[]> {
        const client = await pool.connect();
        try {
            const result = await client.query(`
                SELECT 
                    d.calendar_date::date as date,
                    CASE 
                        WHEN count(a.id) = 0 THEN 'no_data'
                        WHEN bool_or(a.status = 'absent') THEN 'absent'
                        WHEN bool_or(a.status = 'late') THEN 'late'
                        ELSE 'present'
                    END as daily_status
                FROM generate_series(
                    $1::date,
                    LEAST($3::date, CURRENT_DATE),
                    '1 day'::interval
                ) as d(calendar_date)
                LEFT JOIN attendance a 
                ON a.date = d.calendar_date::date 
                    AND a.student_id = $2
                GROUP BY d.calendar_date
                ORDER BY d.calendar_date DESC;
            `, [startDate, studentId, endDate]);

            return result.rows;
        } finally {
            client.release()
        }
    }
    async getClassAttendance(courseId: string, classId: string, startDate: string, endDate: string): Promise<CourseAttendance[]> {
        const client = await pool.connect();
        try {
            const result = await client.query(`
                WITH CalendarDates AS (
                    SELECT generate_series($1::date, $2::date, '1 day'::interval )::date AS calendar_date  
                ),
                CourseStudents AS (
                    SELECT 
                        s.id as student_id,
                        u.full_name as name
                    FROM students s
                    JOIN users u ON s.user_id = u.id
                    WHERE s.course_id = $3
                )
                SELECT
                    cs.student_id,
                    cs.name,
                    cd.calendar_date as date,
                    COALESCE(a.status, 'no_data') as status
                FROM CourseStudents cs
                CROSS JOIN CalendarDates cd
                LEFT JOIN attendance a
                    ON a.student_id = cs.student_id
                    AND a.date = cd.calendar_date
                    AND a.class_id = $4
                ORDER BY cs.name ASC, cd.calendar_date ASC;
            `, [startDate, endDate, courseId, classId]);

            return result.rows;
        } finally {
            client.release()
        }
    }

}