import type {IUserRepository} from "../domain/IUserRepository.js";
import type {UserProfileResponse} from "../domain/User.types.js";
import {pool} from "../../../db/index.js";

export class PostgresUserRepository implements IUserRepository {
    async getUser(userId: string): Promise<UserProfileResponse | null> {
        const client = await pool.connect();
        try {
            const user = await client.query(
                    `SELECT id, school_id, email, full_name, role FROM users WHERE supabase_user_id = $1`,
                    [userId]);

            if (user.rowCount === 0) return null;

            const internalUserId = user.rows[0].id;
            const dbSchoolId = user.rows[0].school_id;
            const email = user.rows[0].email;
            const name = user.rows[0].full_name;
            const realRole = user.rows[0].role;

            let profileId: string | null = null;

            if (realRole === "student") {
                const result = await client.query(
                    `SELECT id FROM students WHERE user_id = $1`,
                    [internalUserId]
                );
                if (result.rows.length > 0) profileId = result.rows[0].id;

            } else if (realRole === "teacher") {
                const result = await client.query(
                    `SELECT id FROM teachers WHERE user_id = $1`,
                    [internalUserId]
                );
                if (result.rows.length > 0) profileId = result.rows[0].id;

            } else if (realRole === "principal") {
                profileId = internalUserId;
            }

            return {
                id: internalUserId,
                role: realRole!,
                name: name!,
                email: email,
                school_id: dbSchoolId,
                profile_id: profileId,
                is_profile_complete: !!profileId
            };
        } finally {
            client.release();
        }
    }
}