import type { IParentRepository } from "../domain/IParentRepository.js";
import type { ParentCredentials, AuthUser } from "../../shared/domain/Shared.types.js";
import { pool } from "../../../db/index.js";
import {supabase} from "../../../services/index.js";
import {ConflictError, ValidationError} from "../../errors/domain/CustomErrors.js";
import {createAuditLog} from "../../../services/audit.service.js";

export class PostgresParentRepository implements IParentRepository {
    async createParent(parentCredentials:ParentCredentials, authUser:AuthUser): Promise<void> {
        const client = await pool.connect();
        let authUserId: string | null = null;
        try {
            await client.query('BEGIN');

            const { data, error } = await supabase.auth.admin.createUser({
                email: parentCredentials.email,
                password: parentCredentials.password,
                email_confirm: true
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
                VALUES ($1, $2, $3, $4, $5, 'parent', $6, $7)
                RETURNING id;
            `, [authUserId, parentCredentials.firstName, parentCredentials.middleName, parentCredentials.firstLastName, parentCredentials.secondLastName, parentCredentials.email, authUser.userSchoolId]);

            const profileId = profile.rows[0].id;

            const parent = await client.query(`INSERT INTO parent (profile_id) VALUES ($1) RETURNING id`, [profileId]);

            const parentId = parent.rows[0].id;

            await createAuditLog(client, {
                targetUserId: profileId,
                actorUserId: authUser.userId,
                actorRole: authUser.userRole,
                action: "CREATE_PARENT",
                schoolId: authUser.userSchoolId,
                metadata: {
                    name: [parentCredentials.firstName, parentCredentials.middleName ?? "", parentCredentials.firstLastName, parentCredentials.secondLastName ?? ""].join(" "),
                    email: parentCredentials.email
                }
            })

            await client.query('COMMIT');
        } catch (error : any) {
            let rolledBack = true;
            try {
                await client.query('ROLLBACK');
            } catch (rollbackError) {
                rolledBack = false;
                console.error('Rollback failed, DB state uncertain:', rollbackError);
            }

            if (authUserId && rolledBack) {
                console.warn(`[Error]: Eliminando usuario huérfano de Supabase: ${authUserId}`);
                await supabase.auth.admin.deleteUser(authUserId);
            } else if (authUserId && !rolledBack) {
                console.error(`Uncertain state for authUserId=${authUserId}, profile may or may not exist. Manual reconciliation needed.`);
            }

            throw error;
        } finally {
            client.release();
        }
    }
}