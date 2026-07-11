import type { IStudentRepository } from "../domain/IStudentRepository.js";
import type { CreateStudent, StudentDetails, Students } from "../domain/Student.types.js";
import { pool } from "../../../db/index.js";
import { supabase } from "../../../services/index.js";
import { createAuditLog } from "../../../services/audit.service.js";
import {ConflictError, NotFoundError, ValidationError} from "../../errors/domain/CustomErrors.js";

export class PostgresStudentRepository implements IStudentRepository {
    async getStudents(userSchoolId: string, isActive: boolean): Promise<Students[]> {
        const client = await pool.connect();
        try {
            const result = await client.query(`
                SELECT
                    c.id as course_id,
                    c.name as course_name,
                    s.id as student_id,
                    p.first_name as student_first_name,
                    p.middle_name as student_middle_name,
                    p.first_last_name as student_first_last_name,
                    p.second_last_name as student_second_last_name,
                    p.email,
                    s.enrollment_code,
                    s.created_at
                FROM student s
                JOIN profile p ON s.profile_id = p.id
                JOIN course c ON s.course_id = c.id
                WHERE p.school_id = $1 AND p.is_active = $2
                ORDER BY p.first_last_name ASC
            `, [userSchoolId, isActive]);

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
                    p.first_name as student_first_name,
                    p.middle_name as student_middle_name,
                    p.first_last_name as student_first_last_name,
                    p.second_last_name as student_second_last_name,
                    p.email,
                    s.enrollment_code,
                    c.name as course_name
                FROM student s
                JOIN profile p ON s.profile_id = p.id
                JOIN course c ON s.course_id = c.id
                WHERE s.id = $1 AND p.school_id = $2
            `, [studentId, userSchoolId]);

            // Here goes the student's grades as well

            if (student.rowCount === 0) return null;

            const studentDetails = student.rows[0];

            return {
                id: studentDetails.student_id,
                student_first_name: studentDetails.student_first_name,
                student_middle_name: studentDetails.student_middle_name,
                student_first_last_name: studentDetails.student_first_last_name,
                student_second_last_name: studentDetails.student_second_last_name,
                email: studentDetails.email,
                course_name: studentDetails.course_name,
                enrollment_code: studentDetails.enrollment_code,
                recent_grades: []
            };
        } finally {
            client.release();
        }
    }

    async createStudent(courseId: string,
                        studentFirstName: string,
                        studentMiddleName: string,
                        studentFirstLastName: string,
                        studentSecondLastName: string,
                        studentEmail: string,
                        studentPassword: string,
                        studentEnrolmentCode: string,
                        userId: string,
                        userRole: string,
                        userSchoolId: string): Promise<CreateStudent> {
        const client = await pool.connect();
        let authUserId: string | null = null;

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

            authUserId = data.user?.id as string;

            const profile = await client.query(`
                INSERT INTO profile (auth_profile_id, first_name, middle_name, first_last_name, second_last_name, role, email, school_id)
                VALUES ($1, $2, $3, $4, $5, 'student', $6, $7)
                RETURNING id;
            `, [authUserId, studentFirstName, studentMiddleName, studentFirstLastName, studentSecondLastName, studentEmail, userSchoolId]);

            const profileId = profile.rows[0].id;

            await client.query(`
                INSERT INTO student (profile_id, enrollment_code, course_id)
                VALUES ($1, $2, $3)
            `, [profileId, studentEnrolmentCode, courseId]);

            await createAuditLog(client, {
                actorUserId: userId,
                actorRole: userRole,
                action: 'CREATE_STUDENT',
                targetUserId: profileId,
                schoolId: userSchoolId,
                metadata: {
                    email: studentEmail,
                    courseId,
                    enrolment: studentEnrolmentCode
                }
            });

            await client.query('COMMIT');

            return { id: profileId };
        } catch (error : any) {
            let rolledBack = true;
            try {
                await client.query('ROLLBACK');
            } catch (rollbackError) {
                rolledBack = false;
                console.error('[CRITICAL] Rollback failed, DB state uncertain:', rollbackError);
            }

            if (authUserId && rolledBack) {
                console.warn(`[Error]: Eliminando usuario huérfano de Supabase: ${authUserId}`);
                await supabase.auth.admin.deleteUser(authUserId);
            } else if (authUserId && !rolledBack) {
                console.error(`[CRITICAL] Uncertain state for authUserId=${authUserId}, profile may or may not exist. Manual reconciliation needed.`);
            }

            throw error;
        } finally {
            client.release();
        }
    }

    async updateStudent(studentId: string,
                        courseId: string,
                        studentFirstName: string,
                        studentMiddleName: string,
                        studentFirstLastName: string,
                        studentSecondLastName: string,
                        studentEnrolmentCode: string,
                        userId: string,
                        userRole: string,
                        userSchoolId: string): Promise<void> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const studentCheck = await client.query(`
                SELECT 
                    s.profile_id
                FROM student s
                JOIN profile p ON s.profile_id = p.id
                WHERE s.id = $1 AND p.school_id = $2
            `, [studentId, userSchoolId]);

            if (studentCheck.rowCount === 0) throw new NotFoundError("El estudiante no se encontro para actualizar");

            const studentProfileId = studentCheck.rows[0].profile_id;

            await client.query(`
                UPDATE profile
                SET first_name = $1, middle_name = $2, first_last_name = $3, second_last_name = $4
                WHERE id = $5
            `, [studentFirstName, studentMiddleName, studentFirstLastName, studentSecondLastName, studentProfileId]);

            await client.query(`
                UPDATE student
                SET enrollment_code = $1, course_id = $2
                WHERE id = $3
            `, [studentEnrolmentCode, courseId, studentId]);

            await createAuditLog(client, {
                actorUserId: userId,
                actorRole: userRole,
                action: 'UPDATE_STUDENT',
                targetUserId: studentProfileId,
                schoolId: userSchoolId,
                metadata: {
                    studentId: studentId,
                    name: [studentFirstName, studentMiddleName, studentFirstLastName, studentSecondLastName].join(" "),
                    course: courseId
                }
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
                    s.profile_id, 
                    p.auth_profile_id,
                    p.first_name as student_first_name,
                    p.middle_name as student_middle_name,
                    p.first_last_name as student_first_last_name,
                    p.second_last_name as student_second_last_name
                FROM student s
                JOIN profile p ON s.profile_id = p.id
                WHERE s.id = $1 AND p.school_id = $2
            `, [studentId, userSchoolId]);

            if (studentCheck.rowCount === 0) throw new NotFoundError("El estudiente no se encontro para su eliminación");

            const {
                profile_id,
                auth_profile_id,
                student_first_name,
                student_middle_name,
                student_first_last_name,
                student_second_last_name,
            } = studentCheck.rows[0];

            await client.query(`DELETE FROM student WHERE id = $1`, [studentId]);
            await client.query(`DELETE FROM profile WHERE id = $1`, [profile_id]);
            const { error } = await supabase.auth.admin.deleteUser(auth_profile_id);

            if (error) throw new ValidationError(`No se pudo eliminar el usuario (${error.message})`);

            await createAuditLog(client, {
                actorUserId: userId,
                actorRole: userRole,
                action: 'DELETE_STUDENT',
                schoolId: userSchoolId,
                metadata: {
                    studentId,
                    name: [student_first_name, student_middle_name, student_first_last_name, student_second_last_name].join(" ")
                }
            });

            await client.query('COMMIT');

            return;
        } catch (error : any) {
            let rolledBack = true;
            try {
                await client.query('ROLLBACK');
            } catch (rollbackError) {
                rolledBack = false;
                console.error('[CRITICAL] Rollback failed during student deletion, DB state uncertain:', rollbackError);
            }

            if (!rolledBack) {
                console.error(`[CRITICAL] Uncertain state deleting student, profile_id may still exist while Supabase user was deleted. Manual reconciliation needed.`);
            }

            if (error.code === '23503') throw new ConflictError("No se puede eliminar el estudiante porque tiene notas o información guardada.");

            throw error;
        } finally {
            client.release();
        }
    }
}