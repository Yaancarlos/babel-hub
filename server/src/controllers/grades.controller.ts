import type { Response } from "express";
import { pool } from "../db/index.js";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";

export async function getGrades(
    req: AuthenticatedRequest,
    res: Response,
) {
    const { role, userId, schoolId } = req.user!;

    try {
        let query = "";
        let params:any[] = [];

        if (role === "student") {
            query = `
                SELECT g.* 
                FROM grades g 
                JOIN students s ON  g.student_id = s.id 
                WHERE s.user_id = $1
            `;
            params = [userId];
        }

        if (role === "teacher") {
            query = `
        SELECT g.*
        FROM grades g
        JOIN classes c ON g.class_id = c.id
        JOIN teachers t ON c.teacher_id = t.id
        WHERE t.user_id = $1
      `;
            params = [userId];
        }

        if (role === "principal") {
            query = `
        SELECT g.*
        FROM grades g
        JOIN classes c ON g.class_id = c.id
        JOIN subjects s ON c.subject_id = s.id
        WHERE s.school_id = $1
      `;
            params = [schoolId];
        }

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch grades" });
    }
}

export async function upsertGrade(
    req: AuthenticatedRequest,
    res: Response
) {
    const { role, userId } = req.user!;
    const { student_id, class_id, grade_value } = req.body;

    if (!["teacher", "principal"].includes(role!)) {
        return res.status(403).json({ message: "Forbidden" });
    }

    try {
        if (role === "teacher") {
            const ownershipCheck = await pool.query(
                `
        SELECT 1
        FROM classes c
        JOIN teachers t ON c.teacher_id = t.id
        WHERE c.id = $1 AND t.user_id = $2
        `,
                [class_id, userId]
            );

            if (ownershipCheck.rowCount === 0) {
                return res.status(403).json({ message: "Not your class" });
            }
        }

        await pool.query(
            `
      INSERT INTO grades (student_id, class_id, grade_value)
      VALUES ($1, $2, $3)
      `,
            [student_id, class_id, grade_value]
        );

        res.json({ message: "Grade saved" });
    } catch (error) {
        res.status(500).json({ message: "Failed to save grade" });
    }
}
