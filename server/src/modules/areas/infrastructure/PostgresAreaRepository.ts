import type { IAreaRepository } from "../domain/IAreaRepository.js";
import type { Area } from "../domain/Areas.types.js"
import { createAuditLog } from "../../../services/audit.service.js";
import { pool } from "../../../db/index.js";
import { NotFoundError, ConflictError } from "../../errors/domain/CustomErrors.js";

export class PostgresAreaRepository implements IAreaRepository  {
    async getAreas(schoolId: string): Promise<Area[]> {
        const client = await pool.connect();
        try {
            const result = await client.query(`
                SELECT * FROM area 
                WHERE school_id = $1 
                ORDER BY name ASC
            `, [schoolId]);

            return result.rows;
        } finally {
            client.release();
        }
    }

    async getAreaDetails(id: string, schoolId: string): Promise<Area | null> {
        const client = await pool.connect();
        try {
            const result = await client.query(`
                SELECT * FROM area
                WHERE id = $1 AND school_id = $2;
            `, [id, schoolId]);

            if (result.rowCount === 0) return null;

            return result.rows[0];
        } finally {
            client.release();
        }
    }

    async insertArea(name: string, userId: string, userRole: string, userSchoolId: string): Promise<Area> {
        const client = await pool.connect();
        try {
            await client.query(`BEGIN`);

            const result = await client.query(`
                INSERT INTO area (school_id, name)
                VALUES ($1, $2)
                RETURNING id, name
            `, [userSchoolId, name]);

            const area = result.rows[0];

            await createAuditLog(client, {
                actorUserId: userId,
                actorRole: userRole,
                action: "CREATE_AREA",
                schoolId: userSchoolId,
                metadata: { areaId: area.id, name: area.name }
            })

            await client.query(`COMMIT`);

            return result.rows[0];
        } catch (error) {
            await client.query(`ROLLBACK`);
            throw error;
        } finally {
            client.release();
        }
    }

    async updateArea(id: string, newName: string, userId: string, userRole: string, userSchoolId: string): Promise<Area> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const result = await client.query(`
                UPDATE area
                SET name = $1 
                WHERE id = $2 AND school_id = $3
                RETURNING id, name
            `, [newName, id, userSchoolId]);

            if (result.rowCount === 0) throw new NotFoundError(`No fue posible actualizar el area ${id}`);

            await createAuditLog(client, {
                actorUserId: userId,
                actorRole: userRole,
                action: "UPDATE_AREA",
                schoolId: userSchoolId,
                metadata: { areaID: id, newName: newName }
            });

            await client.query('COMMIT');

            return result.rows[0];
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async deleteArea(id: string, userId: string, userRole: string, userSchoolId: string): Promise<void> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const result = await client.query(`
                DELETE FROM area
                WHERE id = $1 AND school_id = $2
                RETURNING id, name
            `, [id, userSchoolId]);

            if (result.rowCount === 0) throw new NotFoundError(`No fue posible eliminar el area ${id}`);

            const area = result.rows[0];

            await createAuditLog(client, {
                actorUserId: userId,
                actorRole: userRole,
                action: "DELETE_AREA",
                schoolId: userSchoolId,
                metadata: { areaId: id, deletedName: area.name }
            });

            await client.query('COMMIT');

            return;
        } catch (error : any) {
            await client.query('ROLLBACK');

            if (error.code === '23503') throw new ConflictError(" El area tiene asignaturas activas");

            throw error;
        } finally {
            client.release();
        }
    }
}