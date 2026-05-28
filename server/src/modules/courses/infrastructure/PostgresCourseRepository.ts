import type { ICourseRepository } from "../domain/ICourseRepository.js";
import { pool } from "../../../db/index.js";
import { createAuditLog } from "../../../services/audit.service.js";
import {ConflictError, NotFoundError, UnauthorizedError} from "../../errors/domain/CustomErrors.js";

export class PostgresCourseRepository implements ICourseRepository {
    async getCourses(userSchoolId: string){
        const client = await pool.connect();
        try {
            const result = await client.query(`
                SELECT 
                    c.id, 
                    c.name as course_name,
                    c.created_at,
                    c.year,
                    c.teacher_id as director_id,
                    u.full_name as director_name,
                    COUNT(s.id) as student_count
                FROM courses c
                JOIN teachers t ON c.teacher_id = t.id
                JOIN users u ON t.user_id = u.id
                LEFT JOIN students s ON c.id = s.course_id
                WHERE c.school_id = $1
                GROUP BY
                    c.id,
                    c.name,
                    c.created_at,
                    c.year,
                    c.teacher_id,
                    u.full_name
                ORDER BY c.name::integer ASC;
            `, [userSchoolId]);

            return result.rows;
        } finally {
            client.release();
        }
    }

    async getCourseDetails(courseId: string, userSchoolId: string) {
        const client = await pool.connect();
        try {
            const course = await client.query(`
                SELECT 
                    id,
                    name, 
                    created_at, 
                    year
                FROM courses 
                WHERE id = $1 AND school_id = $2
            `, [courseId, userSchoolId]);

            if (course.rowCount === 0) return null;

            const students = await client.query(`
                SELECT
                    st.id as student_id,
                    u.full_name, 
                    u.email
                FROM students st
                JOIN users u ON st.user_id = u.id
                WHERE st.course_id = $1
                ORDER BY u.full_name ASC
            `, [courseId]);

            const classes = await client.query(`
                SELECT 
                    cl.id as class_id, 
                    s.name as subject_name, 
                    u.full_name as teacher_name
                FROM classes cl
                JOIN subjects s ON cl.subject_id = s.id
                JOIN teachers t ON cl.teacher_id = t.id
                JOIN users u ON t.user_id = u.id
                WHERE cl.course_id = $1
            `, [courseId]);

            return {
                course: course.rows[0],
                students: students.rows,
                classes: classes.rows
            }
        } finally {
            client.release();
        }
    }

    async createCourse(courseName: string, courseYear: string, courseTeacherId: string, userId: string, userRole: string, userSchoolId: string) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const course = await client.query(`
                INSERT INTO courses (school_id, name, year, teacher_id)
                VALUES ($1, $2, $3, $4)
                RETURNING id
            `, [userSchoolId, courseName, courseYear, courseTeacherId]);

            if (course.rowCount === 0) throw new UnauthorizedError("No se pudo crear el curso (verifica permisos o datos)");

            const courseId = course.rows[0].id;

            await createAuditLog(client, {
                actorUserId: userId,
                actorRole: userRole,
                action: "CREATE_COURSE",
                schoolId: userSchoolId,
                metadata: {
                    courseId: courseId,
                    name: courseName
                }
            })

            await client.query('COMMIT');

            return courseId;
        } catch (error) {
            await client.query( 'ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async updateCourse(courseId: string, courseName: string, courseYear: string, courseTeacherId: string, userId: string, userRole: string, userSchoolId: string){
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const result = await client.query(`
                UPDATE courses 
                SET name = $1, year = $2, teacher_id = $3
                WHERE id = $4 AND school_id = $5
                RETURNING id, name
            `, [courseName, courseYear, courseTeacherId, courseId, userSchoolId]);

            if (result.rowCount === 0) throw new NotFoundError("curso no se encontro o sin permisos");

            await createAuditLog(client, {
                actorUserId: userId,
                actorRole: userRole,
                action: "UPDATE_COURSE",
                schoolId: userSchoolId,
                metadata: {
                    courseId: courseId,
                    updatedFields: { courseName, courseYear, courseTeacherId }
                }
            });

            await client.query('COMMIT');

            return result.rows[0];
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async deleteCourse(courseId: string, userId: string, userRole: string, userSchoolId: string) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const checkQuery = await client.query(`
                SELECT 
                    (SELECT COUNT(*) FROM students WHERE course_id = $1) as student_count,
                    (SELECT COUNT(*) FROM classes WHERE course_id = $1) as class_count
            `, [courseId]);

            const studentCount = parseInt(checkQuery.rows[0].student_count);
            const classCount = parseInt(checkQuery.rows[0].class_count);

            if (studentCount > 0 || classCount > 0) throw new ConflictError("No se puede eliminar el curso porque tiene alumnos o clases asignadas");

            const result = await client.query(`
                DELETE FROM courses 
                WHERE id = $1 AND school_id = $2
                RETURNING id, name
            `, [courseId, userSchoolId]);

            if (result.rowCount === 0) {
                throw new NotFoundError("El curso no existe");
            }

            await createAuditLog(client, {
                actorUserId: userId,
                actorRole: userRole,
                action: "DELETE_COURSE",
                schoolId: userSchoolId,
                metadata: {
                    courseId: courseId,
                    courseName: result.rows[0].name
                }
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

    async getTeacherCourse(userId: string, userSchoolId: string) {
        const client = await pool.connect();
        try {
            const result = await client.query(`
                SELECT
                    c.id,
                    c.name,
                    COUNT(s.id) as total_students
                FROM courses c
                JOIN teachers t ON c.teacher_id = t.id
                LEFT JOIN students s ON s.course_id = c.id
                WHERE t.user_id = $1 AND c.school_id = $2
                GROUP BY c.id, c.name;
            `, [userId, userSchoolId]);

            return result.rows[0];
        } finally {
            client.release();
        }
    }
}