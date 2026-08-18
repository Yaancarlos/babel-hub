import type { IScalesRepository } from "../domain/IScalesRepository.js";
import type { Scales } from "../domain/Scales.types.js";
import { pool } from "../../../db/index.js";

export class PostgresScaleRepository implements IScalesRepository{
    async getScales(userSchoolId: string): Promise<Scales[]> {
        const client = await pool.connect();
        try {
            const result = await client.query(`
                SELECT
                    id,
                    name,
                    min_value,
                    max_value,
                    passing_value
                FROM scale;
            `)

            return result.rows;
        } finally {
            client.release();
        }
    }

    async getClassScale(classId: string, userSchoolId: string): Promise<Scales> {
        const client = await pool.connect();
        try {
            const scale = await client.query(`
                SELECT
                    sc.id,
                    sc.name,
                    sc.min_value,
                    sc.max_value,
                    sc.passing_value
                FROM class c
                JOIN subject s ON c.subject_id = s.id
                JOIN grading_template g ON s.grading_template_id = g.id
                JOIN scale sc ON g.scale_id = sc.id
                WHERE c.id = $1 AND g.school_id = $2
            `, [classId, userSchoolId]);

            console.log(scale.rows);

            return scale.rows[0];
        } finally {
            client.release();
        }
    }
}