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
}