import type { IPrincipalRepository } from "../domain/IPrincipalRepository.js";
import { pool } from "../../../db/index.js";
import { supabase } from "../../../services/index.js";
import { createAuditLog } from "../../../services/audit.service.js";
import type { CreatePrincipal } from "../domain/Principal.types.js";
import { ValidationError } from "../../errors/domain/CustomErrors.js";

export class PostgresPrincipalRepository implements IPrincipalRepository {
    async createPrincipal(principalEmail: string,
                          principalPassword: string,
                          principalFirstName: string,
                          principalMiddleName: string,
                          principalFirstLastName: string,
                          principalSecondLastName: string,
                          userId: string,
                          userRole: string,
                          userSchoolId: string): Promise<CreatePrincipal> {
        const client = await pool.connect();
        let authUserId: string | null = null;

        try {
            await client.query('BEGIN');

            const { data, error } = await supabase.auth.admin.createUser({
                email: principalEmail,
                password: principalPassword,
                email_confirm: true
            });

            if (error) throw new ValidationError(`No se pudo crear el usuario (${error.message})`);

            authUserId = data.user?.id as string;

            const profile = await client.query(`
                INSERT INTO profile (auth_profile_id, first_name, middle_name, first_last_name, second_last_name, role, email, school_id) 
                VALUES ($1, $2, $3, $4, $5, 'principal', $6, $7)
                RETURNING id;
            `, [authUserId, principalFirstName, principalMiddleName, principalFirstLastName, principalSecondLastName, principalEmail, userSchoolId]);

            const profileId = profile.rows[0].id;

            await client.query(`
                INSERT INTO principal (profile_id)
                VALUES ($1) 
                RETURNING id;
            `, [profileId]);

            await createAuditLog(client, {
                actorUserId: userId,
                actorRole: userRole,
                schoolId: userSchoolId,
                targetUserId: profileId,
                action: "CREATE_PRINCIPAL",
                metadata: {
                    id: profileId,
                    name:  [principalFirstName, principalMiddleName, principalFirstLastName, principalSecondLastName].join(" "),
                    email: principalEmail,
                }
            });

            await client.query('COMMIT');

            return { id: authUserId };
        } catch (error) {
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