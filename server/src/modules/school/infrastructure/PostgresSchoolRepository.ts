import type { ISchoolRepository } from "../domain/ISchoolRepository.js";
import type { CreateSchool } from "../domain/School.types.js";
import { pool } from "../../../db/index.js";
import { supabase } from "../../../services/index.js";
import { createAuditLog } from "../../../services/audit.service.js";
import { ValidationError } from "../../errors/domain/CustomErrors.js";

export class PostgresSchoolRepository implements ISchoolRepository {
    async createSchool(schoolName: string,
                       principalFirstName: string,
                       principalMiddleName: string,
                       principalFirstLastName: string,
                       principalSecondLastName: string,
                       principalEmail: string,
                       principalPassword: string,
                       userId: string,
                       userRole: string,
                       userSchoolId: string): Promise<CreateSchool> {
        const client = await pool.connect();
        let authUserId: string | null = null;
        try {
            await client.query('BEGIN');

            const school = await client.query(`
            INSERT INTO school (name) VALUES ($1) RETURNING id
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

            authUserId = data.user?.id;

            const profile = await client.query(`
                INSERT INTO profile (auth_profile_id, first_name, middle_name, first_last_name, second_last_name, role, email, school_id) 
                VALUES ($1, $2, $3, $4, $5, 'principal', $6, $7)
                RETURNING id;
            `, [authUserId, principalFirstName, principalMiddleName, principalFirstLastName, principalSecondLastName, principalEmail, schoolId]);

            const profileId = profile.rows[0].id;

            await client.query(`
                INSERT INTO principal (profile_id)
                VALUES ($1)
            `, [profileId]);

            await createAuditLog(client, {
                actorUserId: userId,
                actorRole: userRole,
                action: "CREATE_SCHOOL",
                targetUserId: profileId,
                schoolId,
                metadata: { schoolName }
            })

            await client.query('COMMIT');

            return { id: schoolId };
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
}