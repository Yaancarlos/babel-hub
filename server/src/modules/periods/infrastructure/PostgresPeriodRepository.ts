import type { IPeriodsRepository } from "../domain/IPeriodRepository.js";
import type { CreatePeriod, Period, UpdatePeriod } from "../domain/Period.types.js";
import { pool } from "../../../db/index.js";
import { createAuditLog } from "../../../services/audit.service.js";
import { ConflictError, NotFoundError } from "../../errors/domain/CustomErrors.js";

export class PostgresPeriodRepository implements IPeriodsRepository {
    async getPeriods(userSchoolId: string): Promise<Period[]> {
        const client = await pool.connect();
        try {
            const result = await client.query(`
                SELECT
                    id,
                    name,
                    start_date,
                    end_date
                FROM academic_period
                WHERE school_id = $1
                ORDER BY start_date ASC;
            `, [userSchoolId]);

            return result.rows;
        } finally {
            client.release();
        }
    }

    async createPeriod(periodName: string, startDate: string, endDate: string, userId: string, userRole: string, userSchoolId: string): Promise<CreatePeriod> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const result = await client.query(`
                INSERT INTO academic_period (name, start_date, end_date, school_id)
                VALUES ($1, $2, $3, $4)
                RETURNING id
            `, [periodName, startDate, endDate, userSchoolId]);

            const periodId = result.rows[0].id;

            await createAuditLog(client, {
                actorUserId: userId,
                actorRole: userRole,
                action: "CREATE_PERIOD",
                schoolId: userSchoolId,
                metadata: {
                    periodId: periodId,
                    dates: {
                        start: startDate,
                        end: endDate,
                    }
                }
            })

            await client.query('COMMIT');

            return periodId;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async updatePeriod(periodId: string, periodName: string, startDate: string, endDate: string, userId: string, userRole: string, userSchoolId: string): Promise<UpdatePeriod> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const result = await client.query(`
                UPDATE academic_period
                SET name = $1, start_date = $2, end_date = $3
                WHERE id = $4 AND school_id = $5
                RETURNING id
            `, [periodName, startDate, endDate, periodId, userSchoolId]);

            if (result.rowCount === 0) throw new NotFoundError("El periodo no existe o no pudo ser actualizado");

            const period = result.rows[0].id;

            await createAuditLog(client, {
                actorUserId: userId,
                actorRole: userRole,
                action: "UPDATE_PERIOD",
                schoolId: userSchoolId,
                metadata: {
                    periodId: periodId,
                    updatedFields: { periodName, startDate, endDate }
                }
            });

            await client.query('COMMIT');

            return period;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async deletePeriod(periodId: string, userId: string, userRole: string, userSchoolId: string): Promise<void> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const result = await client.query(`
                DELETE FROM academic_period
                WHERE id = $1 AND school_id = $2
                RETURNING id, name
            `, [periodId, userSchoolId]);

            if (result.rowCount === 0) throw new NotFoundError("El periodo que intentas borrar no existe");

            await createAuditLog(client, {
                actorUserId: userId,
                actorRole: userRole,
                action: "DELETE_PERIOD",
                schoolId: userSchoolId,
                metadata: {
                    periodId: periodId,
                    periodName: result.rows[0].name
                }
            });

            await client.query('COMMIT');
            return;
        } catch (error : any) {
            await client.query('ROLLBACK');

            if (error.code === '23503') throw new ConflictError(" El clase tiene asignaturas y estudiantes activos");

            throw error;
        } finally {
            client.release();
        }
    }
}