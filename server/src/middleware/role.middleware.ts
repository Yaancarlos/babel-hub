import type { Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "./auth.middleware.js";
import { pool } from "../db/index.js"
import type { UserRole } from "../types/types.js";

export function authorizedRoles (
    allow: Array<UserRole>
) {
    return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (!req.user?.supabaseUserId) {
            return res.status(403).send("Unauthenticated");
        }

        try {
            const result = await pool.query(
                `SELECT * FROM users WHERE id = $1`, // Just 'id' or 'users.id'
                [req.user.supabaseUserId]
            );

            if (result.rows.length === 0) {
                return res.status(403).json({ message: "User not registered" });
            }

            const user = result.rows[0];

            if (!allow.includes(user.role)) {
                return res.status(403).send("Forbidden");
            }

            req.user.userId = user.id;
            req.user.role = user.role;
            req.user.schoolId = user.school_id;

            next()
        } catch (error) {
            return res.status(500).json({ message: "Authorization error" });
        }
    }
}