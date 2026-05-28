import type { IStudentRepository } from "../domain/IStudentRepository.js";
import type { CreateStudent, StudentDetails, Students } from "../domain/Student.types.js";
import { pool } from "../../../db/index.js";
import { supabase } from "../../../services/index.js";
import { createAuditLog } from "../../../services/audit.service.js";
import {ConflictError, NotFoundError, ValidationError} from "../../errors/domain/CustomErrors.js";

export class PostgresStudentRepository implements IStudentRepository {
    async getStudents(userSchoolId: string): Promise<Students[]> {
        const client = await pool.connect();
        try {
            const result = await client.query(`
                SELECT
                    c.id as course_id,
                    c.name as course_name,
                    s.id as student_id,
                    u.full_name,
                    u.email,
                    s.enrollment_code,
                    s.created_at
                FROM students s
                JOIN users u ON s.user_id = u.id
                JOIN courses c ON s.course_id = c.id
                WHERE u.school_id = $1
                ORDER BY u.full_name ASC
            `, [userSchoolId]);

            return result.rows;
        } finally {
            client.release();
        }
    }

    async getStudentDetails(studentId: string, userSchoolId: string): Promise<StudentDetails | null> {
        const client = await pool.connect();
        try {
            const student = await client.query(`
                SELECT
                    s.id as student_id,
                    u.full_name,
                    u.email,
                    s.enrollment_code,
                    c.name as course_name
                FROM students s
                JOIN users u ON s.user_id = u.id
                JOIN courses c ON s.course_id = c.id
                WHERE s.id = $1 AND u.school_id = $2
            `, [studentId, userSchoolId]);

            // Here goes the student's grades as well

            if (student.rowCount === 0) return null;

            const studentDetails = student.rows[0];

            return {
                id: studentDetails.student_id,
                full_name: studentDetails.full_name,
                email: studentDetails.email,
                course_name: studentDetails.course_name,
                enrollment_code: studentDetails.enrollment_code,
                recent_grades: []
            };
        } finally {
            client.release();
        }
    }

    async createStudent(courseId: string, studentName: string, studentEmail: string, studentPassword: string, studentEnrolmentCode: string, userId: string, userRole: string, userSchoolId: string): Promise<CreateStudent> {
        const client = await pool.connect();
        let supabaseUserId: string | null = null;
        try {
            await client.query('BEGIN');

            const { data, error } = await supabase.auth.admin.createUser({
                email: studentEmail,
                password: studentPassword,
                email_confirm: true,
            })

            if (error) {
                if (error.code === 'email_exists') {
                    throw new ConflictError("Ya existe un usuario con la misma dirrecion de email");
                }

                throw new ValidationError(`No se pudo crear el usuario (${error.message})`);
            }

            supabaseUserId = data.user?.id as string;

            const student = await client.query(`
                INSERT INTO users (supabase_user_id, role, school_id, email, full_name) 
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id
            `, [supabaseUserId, 'student', userSchoolId, studentEmail, studentName]);

            const studentId = student.rows[0].id;

            await client.query(`
                INSERT INTO students (user_id, enrollment_code, course_id)
                VALUES ($1, $2, $3)
            `, [studentId, studentEnrolmentCode, courseId]);

            await createAuditLog(client, {
                actorUserId: userId,
                actorRole: userRole,
                action: 'CREATE_STUDENT',
                targetUserId: supabaseUserId,
                schoolId: userSchoolId,
                metadata: {
                    email: studentEmail,
                    courseId,
                    enrolment: studentEnrolmentCode
                }
            });

            await client.query('COMMIT');

            return { id: studentId };
        } catch (error : any) {
            await client.query('ROLLBACK');

            if (supabaseUserId) {
                console.warn(`[Error]: Eliminando usuario huérfano de Supabase: ${supabaseUserId}`);
                await supabase.auth.admin.deleteUser(supabaseUserId);
            }

            throw error;
        } finally {
            client.release();
        }
    }

    async updateStudent(studentId: string, courseId: string, studentName: string, studentEnrolmentCode: string, userId: string, userRole: string, userSchoolId: string): Promise<void> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const studentCheck = await client.query(`
                SELECT 
                    s.user_id
                FROM students s
                JOIN users u ON s.user_id = u.id
                WHERE s.id = $1 AND u.school_id = $2
            `, [studentId, userSchoolId]);

            if (studentCheck.rowCount === 0) throw new NotFoundError("El estudiante no se encontro para actualizar");

            const studentUserId = studentCheck.rows[0].user_id;

            await client.query(`
                UPDATE users
                SET full_name = $1
                WHERE id = $2
            `, [studentName, studentUserId]);

            await client.query(`
                UPDATE students
                SET enrollment_code = $1, course_id = $2
                WHERE id = $3
            `, [studentEnrolmentCode, courseId, studentId]);

            await createAuditLog(client, {
                actorUserId: userId,
                actorRole: userRole,
                action: 'UPDATE_STUDENT',
                targetUserId: studentId,
                schoolId: userSchoolId,
                metadata: { studentId: studentId, name: studentName, course: courseId }
            });

            await client.query('COMMIT');

            return;
        } catch (error : any) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async deleteStudent(studentId: string, userId: string, userRole: string, userSchoolId: string): Promise<void> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const studentCheck = await client.query(`
                SELECT 
                    s.user_id, 
                    u.supabase_user_id, 
                    u.full_name
                FROM students s
                JOIN users u ON s.user_id = u.id
                WHERE s.id = $1 AND u.school_id = $2
            `, [studentId, userSchoolId]);

            if (studentCheck.rowCount === 0) throw new NotFoundError("El estudiente no se encontro para su eliminación");

            const { user_id, supabase_user_id, full_name } = studentCheck.rows[0];

            await client.query(`DELETE FROM students WHERE id = $1`, [studentId]);
            await client.query(`DELETE FROM users WHERE id = $1`, [user_id]);
            const { error } = await supabase.auth.admin.deleteUser(supabase_user_id);

            if (error) throw new ValidationError(`No se pudo eliminar el usuario (${error.message})`);

            await createAuditLog(client, {
                actorUserId: userId,
                actorRole: userRole,
                action: 'DELETE_STUDENT',
                schoolId: userSchoolId,
                metadata: { studentId, name: full_name }
            });

            await client.query('COMMIT');

            return;
        } catch (error : any) {
            await client.query('ROLLBACK');

            if (error.code === '23503') throw new Error("No se puede eliminar el estudiante por que tiene notas o informacion guardada.");

            throw error;
        } finally {
            client.release();
        }
    }
}