import type { IClassRepository } from "../domain/IClassRepository.js";
import { pool } from "../../../db/index.js";
import { createAuditLog } from "../../../services/audit.service.js";
import {ConflictError, NotFoundError} from "../../errors/domain/CustomErrors.js";

export class PostgresClassRepository implements IClassRepository {
    async getClassDetails(classId: string, userSchoolId: string) {
        const client = await pool.connect();
        try {
            const classDetails = await client.query(`
                SELECT
                    cl.id,
                    cl.course_id,
                    c.name as course_name,
                    s.name as subject_name,
                    t.id as teacher_id,
                    u.full_name as teacher_name,
                    cl.created_at
                FROM classes cl
                JOIN courses c ON cl.course_id = c.id
                JOIN subjects s ON cl.subject_id = s.id
                JOIN teachers t ON cl.teacher_id = t.id
                JOIN users u ON t.user_id = u.id
                WHERE cl.id = $1 AND c.school_id = $2
            `, [classId, userSchoolId]);

            if (classDetails.rowCount === 0) return null;

            const courseId = classDetails.rows[0].course_id;

            const studentsDetails = await client.query(`
                SELECT
                    st.id as student_id,
                    u.full_name, 
                    u.email
                FROM students st
                JOIN users u ON st.user_id = u.id
                WHERE st.course_id = $1
                ORDER BY u.full_name ASC
            `, [courseId])

            return {
                details: classDetails.rows[0],
                students: studentsDetails.rows,
                assignments: []
            };
        } finally {
            client.release();
        }
    }

    async createClass(courseId: string, subjectId: string, teacherId: string, userId: string, userRole: string, userSchoolId: string) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const ownershipCheck = await client.query(`
                SELECT 1 
                FROM courses c
                JOIN subjects s ON s.id = $2
                JOIN teachers t ON t.id = $3
                JOIN users tu ON t.user_id = tu.id
                WHERE c.id = $1 
                AND c.school_id = $4 
                AND s.school_id = $4 
                AND tu.school_id = $4
            `, [courseId, subjectId, teacherId, userSchoolId]);

            if (ownershipCheck.rowCount === 0) throw new NotFoundError("La clase no se puede crear o no tienes acceso");

            const result = await client.query(`
                INSERT INTO classes (course_id, subject_id, teacher_id)
                VALUES ($1, $2, $3)
                RETURNING id
            `, [courseId, subjectId, teacherId]);

            const newClassId = result.rows[0].id;

            await createAuditLog(client, {
                actorUserId: userId,
                actorRole: userRole,
                action: "CREATE_CLASS",
                targetUserId: teacherId,
                schoolId: userSchoolId,
                metadata: {
                    classId: newClassId,
                    courseId,
                    subjectId,
                }
            });

            await client.query('COMMIT');

            return newClassId;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async updateClass(classId: string, teacherId: string, userId: string, userRole: string, userSchoolId: string): Promise<void> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const classData = await client.query(`
                SELECT cl.teacher_id
                FROM classes cl
                JOIN courses c ON cl.course_id = c.id
                WHERE cl.id = $1 AND c.school_id = $2
            `, [classId, userSchoolId]);

            if (classData.rowCount === 0) throw new NotFoundError("No se encontro la clases para actualizar");

            const oldTeacherId = classData.rows[0].teacher_id;

            await client.query(`
                UPDATE classes
                SET teacher_id = $1
                WHERE id = $2
            `, [teacherId, classId]);

            await createAuditLog(client, {
                actorUserId: userId,
                actorRole: userRole,
                action: "UPDATE_CLASS_TEACHER",
                schoolId: userSchoolId,
                metadata: {
                    classId: classId,
                    oldTeacherId: oldTeacherId,
                    newTeacherId: teacherId,
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

    async deleteClass(classId: string, userId: string, userRole: string, userSchoolId: string) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const verifyOwnership = await client.query(`
                SELECT cl.id
                FROM classes cl
                JOIN courses c ON cl.course_id = c.id
                WHERE cl.id = $1 AND c.school_id = $2
            `, [classId, userSchoolId]);

            if (verifyOwnership.rowCount === 0) throw new NotFoundError("No se encontro la clase para eliminar");

            await client.query(`
                DELETE FROM classes
                WHERE id = $1
            `, [classId]);

            await createAuditLog(client, {
                actorUserId: userId,
                actorRole: userRole,
                action: "DELETE_CLASS",
                schoolId: userSchoolId,
                metadata: { classId: classId }
            });

            await client.query('COMMIT');

            return;
        } catch (error : any) {
            await client.query('ROLLBACK');

            if (error.code === '23503') throw new ConflictError(" El clase tiene asignaturas y estudiantes activos");

            throw error;
        } finally {
            client.release();
        }
    }

    async getTeacherClasses(teacherId: string, teacherSchoolId: string) {
        const client = await pool.connect();
        try {
            const result = await client.query(`
                SELECT 
                    cl.id as class_id,
                    s.name as subject_name,
                    co.id as course_id,
                    co.name as course_name,
                    COUNT(st.id) as total_students
                FROM classes cl
                JOIN subjects s ON cl.subject_id = s.id
                JOIN courses co ON cl.course_id = co.id
                LEFT JOIN students st ON co.id = st.course_id
                JOIN teachers t ON cl.teacher_id = t.id
                WHERE t.user_id = $1 AND co.school_id = $2 
                GROUP BY cl.id,
                         s.name,
                         co.name,
                         co.id
                ORDER BY co.name::integer, s.name;
            `, [teacherId, teacherSchoolId]);

            return result.rows;
        } finally {
            client.release();
        }
    }

    async getTeacherClassDetails(classId: string, teacherId: string, teacherSchoolId: string) {
        const client = await pool.connect();
        try {
            const classDetails = await client.query(`
                SELECT
                    cs.id as course_id,
                    cs.name AS course_name,
                    sb.name AS subject_name,
                    s.id AS student_id,
                    u.full_name AS student_name
                FROM classes cl
                JOIN courses cs ON cl.course_id = cs.id
                JOIN subjects sb ON cl.subject_id = sb.id
                JOIN teachers t ON cl.teacher_id = t.id
                LEFT JOIN students s ON s.course_id = cs.id
                LEFT JOIN users u ON s.user_id = u.id
                WHERE cl.id = $1
                AND cs.school_id = $2
                AND t.user_id = $3
                ORDER BY u.full_name ASC
            `, [classId, teacherSchoolId, teacherId]);

            const rows = classDetails.rows;

            if (rows.length === 0) return null;

            return {
                course_id: rows[0].course_id,
                subject_name: rows[0].subject_name,
                course_name: rows[0].course_name,
                total_students: rows.filter((s: any) => s.student_id !== null).length,
                students: rows
                    .filter((s: any) => s.student_id !== null)
                    .map(row => ({
                        student_id: row.student_id,
                        student_name: row.student_name,
                    }))
            }
        } finally {
            client.release();
        }
    }
}