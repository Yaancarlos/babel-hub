import type { Response } from "express";
import { pool } from "../db/index.js";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";

export async function getUserRole(
    req: AuthenticatedRequest,
    res: Response
) {
    const { userId, role, email, schoolId } = req.user!;

    try {
        let profile:any = null;

        if (role === "student") {
            const result = await pool.query(
                `SELECT id FROM students WHERE userId = $1`,
                [userId]
            );
            profile = { student: result.rows[0]?.id };
        }

        if (role === "teacher") {
            const result = await pool.query(
                `SELECT id FROM teachers WHERE user_id = $1`,
                [userId]
            );
            profile = { teacher: result.rows[0]?.id };
        }

        if (role === "principal") {
            const result = await pool.query(
                `SELECT id FROM principals WHERE user_id = $1`,
                [userId]
            );
            profile = { principal: result.rows[0]?.id };
        }

        res.json({
            id: userId,
            role: role,
            email: email,
            school: schoolId,
            profile: profile
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to load profile" });
    }
}