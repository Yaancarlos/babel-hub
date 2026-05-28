import type { ISchoolRepository } from "../domain/ISchoolRepository.js";
import type { CreateSchool } from "../domain/School.types.js";
import { pool } from "../../../db/index.js";
import { supabase } from "../../../services/index.js";
import { createAuditLog } from "../../../services/audit.service.js";
import { ValidationError } from "../../errors/domain/CustomErrors.js";

export class PostgresSchoolRepository implements ISchoolRepository {
    async createSchool(schoolName: string, principalName: string, principalEmail: string, principalPassword: string, userId: string, userRole: string, userSchoolId: string): Promise<CreateSchool> {
        const client = await pool.connect();
        let supabaseUserId: string | null = null;
        try {
            await client.query('BEGIN');

            const school = await client.query(`
                INSERT INTO schools (name) VALUES ($1) RETURNING id
            `, [schoolName]);

            const schoolId = school.rows[0].id;

            const { data, error } = await supabase.auth.admin.createUser({
                email: principalEmail,
                password: principalPassword,
                email_confirm: true,
            })

            if (error) {
                throw new ValidationError(`No se pudo crear el usuario (${error.message})`);
            }

            supabaseUserId = data.user?.id;

            await client.query(`
                INSERT INTO users (supabase_user_id, role, school_id, email, full_name)
                VALUES ($1, $2, $3, $4, $5)
            `, [supabaseUserId, 'principal', schoolId, principalEmail, principalName]);

            await createAuditLog(client, {
                actorUserId: userId,
                actorRole: userRole,
                action: "CREATE_SCHOOL",
                targetUserId: supabaseUserId,
                schoolId,
                metadata: { schoolName }
            })

            await client.query('COMMIT');

            return { id: schoolId };
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
}