import type { IPrincipalRepository } from "../domain/IPrincipalRepository.js";
import { pool } from "../../../db/index.js";
import { supabase } from "../../../services/index.js";
import { createAuditLog } from "../../../services/audit.service.js";
import type { CreatePrincipal } from "../domain/Principal.types.js";
import { ValidationError } from "../../errors/domain/CustomErrors.js";

export class PostgresPrincipalRepository implements IPrincipalRepository {
    async createPrincipal(principalEmail: string, principalPassword: string, principalName: string, userId: string, userRole: string, userSchoolId: string): Promise<CreatePrincipal> {
        const client = await pool.connect();
        let supabaseUserId: string | null = null;

        try {
            await client.query('BEGIN');

            const { data, error } = await supabase.auth.admin.createUser({
                email: principalEmail,
                password: principalPassword,
                email_confirm: true
            });

            if (error) throw new ValidationError(`No se pudo crear el usuario (${error.message})`);

            supabaseUserId = data.user?.id as string;

            await client.query(`
                INSERT INTO users (supabase_user_id, email, role, school_id, full_name) 
                VALUES ($1, $2, 'principal', $3, $4)
            `, [supabaseUserId, principalEmail, userSchoolId, principalName]);

            await createAuditLog(client, {
                actorUserId: userId,
                actorRole: userRole,
                schoolId: userSchoolId,
                targetUserId: supabaseUserId,
                action: "CREATE_PRINCIPAL",
                metadata: {
                    name: principalName,
                    email: principalEmail,
                }
            });

            await client.query('COMMIT');

            return { id: supabaseUserId };
        } catch (error) {
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