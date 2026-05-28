import type { ITeacherRepository } from "../domain/ITeacherRepository.js";
import type { ClassRow, CreateTeacher, TeacherDetails, TeacherRow, Teachers } from "../domain/Teacher.types.js";
import { pool } from "../../../db/index.js";
import { supabase } from "../../../services/index.js";
import { createAuditLog } from "../../../services/audit.service.js";
import { ConflictError, NotFoundError, ValidationError } from "../../errors/domain/CustomErrors.js";

export class PostgresTeacherRepository implements ITeacherRepository {
    async getTeachers(userSchoolId: string, available: string | undefined, includeTeacherId: string | undefined): Promise<Teachers[]> {
        const client = await pool.connect();
        try {
            let queryText = `
                SELECT
                    t.id,
                    u.full_name,
                    u.email,
                    t.created_at,
                    COUNT(DISTINCT cl.id)::int AS total_classes
                FROM teachers t
                JOIN users u ON t.user_id = u.id
                LEFT JOIN classes cl ON cl.teacher_id = t.id
            `;

            const values: any[] = [userSchoolId];
            const whereClauses: string[] = ['u.school_id = $1'];

            if (available === 'true') {
                queryText += ` LEFT JOIN courses co ON t.id = co.teacher_id `;

                if (includeTeacherId) {
                    values.push(includeTeacherId);
                    whereClauses.push(`(co.id IS NULL OR t.id = $${values.length})`);
                } else {
                    whereClauses.push(`co.id IS NULL`);
                }
            }

            queryText += ` WHERE ${whereClauses.join(' AND ')} `;

            queryText += `
                GROUP BY t.id, u.full_name, u.email, t.created_at
                ORDER BY u.full_name ASC;
            `;

            const result = await client.query(queryText, values);
            return result.rows;
        } finally {
            client.release();
        }
    }

    async getTeacherDetails(teacherId: string, userSchoolId: string): Promise<TeacherDetails | null> {
        const client = await pool.connect();
        try {
            const teacher = await client.query<TeacherRow>(`
                SELECT
                    t.id as teacher_id,
                    u.full_name,
                    u.email,
                    t.created_at
                FROM teachers t
                JOIN users u ON t.user_id = u.id
                WHERE t.id = $1 AND u.school_id = $2
            `, [teacherId, userSchoolId]);

            if (teacher.rowCount === 0) return null;

            const classes = await client.query<ClassRow>(`
                SELECT 
                    c.id as class_id,
                    s.name as subject_name,
                    co.name as course_name
                FROM classes c
                JOIN subjects s ON c.subject_id = s.id
                JOIN courses co ON c.course_id = co.id
                WHERE c.teacher_id = $1
                ORDER BY co.name ASC
            `, [teacherId]);

            return {
                teacher: teacher.rows[0]!,
                classes: classes.rows
            }
        } finally {
            client.release();
        }
    }

    async createTeacher(teacherName: string, teacherPassword: string, teacherEmail: string, userId: string, userRole: string, userSchoolId: string): Promise<CreateTeacher> {
        const client = await pool.connect();
        let supabaseUserId: string | null = null;
        try {
            await client.query('BEGIN');

            const { data, error } = await supabase.auth.admin.createUser({
                email: teacherEmail,
                password: teacherPassword,
                email_confirm: true
            })

            if (error) {
                if (error.code === 'email_exists') {
                    throw new ConflictError("Ya existe un usuario con la misma dirrecion de email");
                }

                throw new ValidationError(`No se pudo crear el usuario (${error.message})`);
            }

            supabaseUserId = data.user?.id as string;

            const userTeacher = await client.query(`
                    INSERT INTO users (supabase_user_id, role, school_id, email, full_name) 
                    VALUES ($1, 'teacher', $2, $3, $4)
                    RETURNING id`
                , [supabaseUserId, userSchoolId, teacherEmail, teacherName]);

            const userTeacherId = userTeacher.rows[0].id;

            const teacher = await client.query(`INSERT INTO teachers (user_id) VALUES ($1) RETURNING id`, [userTeacherId]);

            const teacherId = teacher.rows[0].id;

            await createAuditLog(client, {
                targetUserId: teacherId,
                actorUserId: userId,
                actorRole: userRole,
                action: "CREATE_TEACHER",
                schoolId: userSchoolId,
                metadata: {
                    name: teacherName,
                    email: teacherEmail
                }
            })

            await client.query('COMMIT');

            return { id: teacherId };
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

    async updateTeacher(teacherId: string, teacherName: string, userId: string, userRole: string, userSchoolId: string): Promise<void> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const teacherCheck = await client.query(`
                SELECT 
                    t.user_id
                FROM teachers t
                JOIN users u ON t.user_id = u.id
                WHERE t.id = $1 AND u.school_id = $2
            `, [teacherId, userSchoolId]);

            if (teacherCheck.rowCount === 0) throw new NotFoundError("No se encontro al maestro");

            const teacherUserId = teacherCheck.rows[0].user_id;

            await client.query(`
                UPDATE users 
                SET full_name = $1 
                WHERE id = $2
            `, [teacherName, teacherUserId]);

            await createAuditLog(client, {
                actorUserId: userId,
                actorRole: userRole,
                action: 'UPDATE_TEACHER',
                targetUserId: teacherId,
                schoolId: userSchoolId,
                metadata: { teacherId: teacherId, name: teacherName }
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

    async deleteTeacher(teacherId: string, userId: string, userRole: string, userSchoolId: string): Promise<void> {
        const client = await pool.connect()
        try {
            await client.query('BEGIN');

            const teacher = await client.query(`
                SELECT 
                    t.user_id, 
                    u.supabase_user_id, 
                    u.full_name
                FROM teachers t
                JOIN users u ON t.user_id = u.id
                WHERE t.id = $1 AND u.school_id = $2
            `, [teacherId, userSchoolId]);

            if (teacher.rowCount === 0) throw new NotFoundError("No se encontro al maestro");

            const { user_id, supabase_user_id, full_name } = teacher.rows[0];

            await client.query(`DELETE FROM teachers WHERE id = $1`, [teacherId]);
            await client.query(`DELETE FROM users WHERE id = $1`, [user_id]);

            const { error } = await supabase.auth.admin.deleteUser(supabase_user_id);

            if (error) throw new ValidationError(`No se pudo eliminar el usuario (${error.message})`);

            await createAuditLog(client, {
                actorUserId: userId,
                actorRole: userRole,
                action: 'DELETE_TEACHER',
                schoolId: userSchoolId,
                metadata: { teacherId: teacherId, name: full_name }
            });

            await client.query('COMMIT');
            return;
        } catch (error : any) {
            await client.query('ROLLBACK');

            if (error.code === '23503') throw new ConflictError("No se puede eliminar al profesor porque actualmente está asignado a clases activas o actúa como director de curso.");

            throw error;
        } finally {
            client.release();
        }
    }

}