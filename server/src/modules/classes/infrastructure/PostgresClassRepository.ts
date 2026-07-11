import type { IClassRepository } from "../domain/IClassRepository.js";
import { pool } from "../../../db/index.js";
import { createAuditLog } from "../../../services/audit.service.js";
import { ConflictError, NotFoundError } from "../../errors/domain/CustomErrors.js";
import type { ClassDetails, TeacherClassDetails, TeacherClasses } from "../domain/Classes.types.js";

export class PostgresClassRepository implements IClassRepository {
    async getClassDetails(classId: string, userSchoolId: string, isActive: boolean): Promise<ClassDetails | null> {
        const client = await pool.connect();
        try {
            const classDetails = await client.query(`
                SELECT
                    cl.id,
                    cl.course_id,
                    c.name as course_name,
                    s.name as subject_name,
                    t.id as teacher_id,
                    p.first_name as teacher_first_name,
                    p.middle_name as teacher_middle_name,
                    p.first_last_name as teacher_first_last_name,
                    p.second_last_name as teacher_second_last_name,
                    cl.created_at
                FROM class cl
                JOIN course c ON cl.course_id = c.id
                JOIN subject s ON cl.subject_id = s.id
                JOIN teacher t ON cl.teacher_id = t.id
                JOIN profile p ON t.profile_id = p.id
                WHERE cl.id = $1 AND c.school_id = $2
            `, [classId, userSchoolId]);

            if (classDetails.rowCount === 0) return null;

            const courseId = classDetails.rows[0].course_id;

            const studentsDetails = await client.query(`
                SELECT
                    st.id as student_id,
                    p.first_name,
                    p.middle_name,
                    p.first_last_name,
                    p.second_last_name,
                    p.email
                FROM student st
                JOIN profile p ON st.profile_id = p.id
                WHERE st.course_id = $1 AND p.is_active = $2
                ORDER BY p.first_last_name ASC;
            `, [courseId, isActive])

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
                FROM course c
                JOIN subject s ON s.id = $2
                JOIN area a ON s.area_id = a.id
                JOIN teacher t ON t.id = $3
                JOIN profile p ON t.profile_id = p.id
                WHERE c.id = $1
                    AND c.school_id = $4
                    AND a.school_id = $4
                    AND p.school_id = $4
            `, [courseId, subjectId, teacherId, userSchoolId]);

            if (ownershipCheck.rowCount === 0) throw new NotFoundError("La clase no se puede crear o no tienes acceso");

            const result = await client.query(`
                INSERT INTO class (course_id, subject_id, teacher_id)
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
                FROM class cl
                JOIN course c ON cl.course_id = c.id
                WHERE cl.id = $1 AND c.school_id = $2
            `, [classId, userSchoolId]);

            if (classData.rowCount === 0) throw new NotFoundError("No se encontro la clases para actualizar");

            const oldTeacherId = classData.rows[0].teacher_id;

            await client.query(`
                UPDATE class
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

    async deleteClass(classId: string, userId: string, userRole: string, userSchoolId: string): Promise<void> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const verifyOwnership = await client.query(`
                SELECT cl.id
                FROM class cl
                JOIN course c ON cl.course_id = c.id
                WHERE cl.id = $1 AND c.school_id = $2
            `, [classId, userSchoolId]);

            if (verifyOwnership.rowCount === 0) throw new NotFoundError("No se encontro la clase para eliminar");

            await client.query(`
                DELETE FROM class
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

    async getTeacherClasses(teacherId: string, teacherSchoolId: string, isActive: boolean): Promise<TeacherClasses[]> {
        const client = await pool.connect();
        try {
            const result = await client.query(`
                SELECT 
                    cl.id as class_id,
                    s.name as subject_name,
                    co.id as course_id,
                    co.name as course_name,
                    COUNT(st.id)::int as total_students
                FROM class cl
                JOIN subject s ON cl.subject_id = s.id
                JOIN course co ON cl.course_id = co.id
                LEFT JOIN student st ON co.id = st.course_id
                JOIN teacher t ON cl.teacher_id = t.id
                WHERE t.profile_id = $1 AND cl.is_active = $2 AND co.school_id = $3
                GROUP BY cl.id,
                         s.name,
                         co.name,
                         co.id
                ORDER BY co.name::integer, s.name;
            `, [teacherId, isActive, teacherSchoolId]);

            return result.rows;
        } finally {
            client.release();
        }
    }

    async getTeacherClassDetails(classId: string, teacherId: string, teacherSchoolId: string): Promise<TeacherClassDetails | null> {
        const client = await pool.connect();
        try {
            const classDetails = await client.query(`
                SELECT
                    cs.id as course_id,
                    cs.name AS course_name,
                    sb.name AS subject_name,
                    s.id AS student_id,
                    p.first_name as student_first_name,
                    p.middle_name as student_middle_name,
                    p.first_last_name as student_first_last_name,
                    p.second_last_name as student_second_last_name
                FROM class cl
                JOIN course cs ON cl.course_id = cs.id
                JOIN subject sb ON cl.subject_id = sb.id
                JOIN teacher t ON cl.teacher_id = t.id
                LEFT JOIN student s ON s.course_id = cs.id
                LEFT JOIN profile p ON s.profile_id = p.id
                WHERE cl.id = $1
                AND cs.school_id = $2
                AND t.profile_id = $3
                ORDER BY p.first_last_name ASC;
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
                    .map((row: any) => ({
                        student_id: row.student_id,
                        student_first_name: row.student_first_name,
                        student_middle_name: row.student_middle_name,
                        student_first_last_name: row.student_first_last_name,
                        student_second_last_name: row.student_second_last_name,
                    }))
            }
        } finally {
            client.release();
        }
    }
}