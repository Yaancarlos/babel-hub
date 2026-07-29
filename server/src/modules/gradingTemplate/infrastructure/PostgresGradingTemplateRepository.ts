import type { IGradingTemplateRepository } from "../domain/IGradingTemplateRepository.js";
import type {AssessmentCriteria, GradingTemplate} from "../domain/GradingTemplate.types.js";
import { pool } from "../../../db/index.js";
import { createAuditLog } from "../../../services/audit.service.js";
import { ConflictError, NotFoundError } from "../../errors/domain/CustomErrors.js";

export class PostgresGradingTemplateRepository implements IGradingTemplateRepository {
    async getGradingTemplates (userSchoolId: string): Promise<GradingTemplate[]> {
        const client = await pool.connect();
        try {
            const result = await client.query(`
                SELECT
                    id,
                    name,
                    school_id,
                    scale_id
                FROM grading_template
                WHERE school_id = $1
                ORDER BY name ASC;
            `, [userSchoolId]);

            return result.rows;
        } finally {
            client.release();
        }
    }

    async getGradingTemplateDetails(gradingId: string, userSchoolId: string): Promise<AssessmentCriteria> {
        const client = await pool.connect();
        try {
            const grading = await client.query(`
                SELECT
                    name AS grading_name
                FROM grading_template
                WHERE school_id = $1 AND id = $2
            `, [userSchoolId, gradingId]);

            if (grading.rowCount === 0) throw new NotFoundError(`No se encontro el criterio con el id ${gradingId}`);

            const assessment = await client.query(`
                SELECT
                    id,
                    name,
                    weight
                FROM assessment_criteria
                WHERE grading_template_id = $1
                ORDER BY name ASC;
            `, [gradingId]);

            return {
                grading_name: grading.rows[0].grading_name,
                assessments: assessment.rows
            };
        } finally {
            client.release();
        }
    }
    async createGradingTemplate(gradingName: string, gradingScaleId: string, userId: string, userRole: string, userSchoolId: string): Promise<void> {
        const client = await pool.connect();
        try {
            await client.query(`BEGIN`);

            const grading = await client.query(`
                INSERT INTO grading_template(name, school_id, scale_id)
                VALUES ($1, $2, $3)
                RETURNING id
            `, [gradingName, userSchoolId, gradingScaleId]);

            const gradingId = grading.rows[0].id;

            await createAuditLog(client, {
                actorUserId: userId,
                actorRole: userRole,
                action: "CREATE_GRADING_TEMPLATE",
                schoolId: userSchoolId,
                metadata: {
                    gradingId: gradingId,
                    gradingName: gradingName,
                }
            })

            await client.query(`COMMIT`);

            return;
        } catch (error: any) {
            await client.query(`ROLLBACK`);
            if (error.code === '23503') throw new ConflictError("La escala seleccionada no existe");
            throw error;
        } finally {
            client.release();
        }
    }
    async deleteGradingTemplate(gradingId: string, userId: string, userRole: string, userSchoolId: string): Promise<void> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const grading = await client.query(`
                SELECT 1
                FROM grading_template
                WHERE id = $1 AND school_id = $2
            `, [gradingId, userSchoolId]);

            if (grading.rowCount === 0) throw new NotFoundError(`No fue posible eliminar el criterio con id ${gradingId}`)

            await client.query(`
                DELETE FROM grading_template
                WHERE id = $1 AND school_id = $2
            `, [gradingId, userSchoolId]);

            await createAuditLog(client, {
                actorUserId: userId,
                actorRole: userRole,
                action: "DELETE_GRADING_TEMPLATE",
                schoolId: userSchoolId,
                metadata: {
                    gradingId: gradingId
                }
            })

            await client.query('COMMIT');
            return;
        } catch (error: any) {
            await client.query('ROLLBACK');

            if (error.code === '23503') throw new ConflictError(" El criterio tiene evaluaciones activas");

            throw error;
        } finally {
            client.release();
        }
    }
    async updateGradingTemplate(gradingId: string, gradingName: string, gradingScaleId: string, userId: string, userRole: string, userSchoolId: string): Promise<void> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const result = await client.query(`
                UPDATE grading_template
                SET name = $1, scale_id = $2
                WHERE id = $3 and school_id = $4
            `, [gradingName, gradingScaleId, gradingId, userSchoolId]);

            if (result.rowCount === 0) throw new NotFoundError(`No se encontro el criterio con id ${gradingId}`);

            await createAuditLog(client, {
                actorUserId: userId,
                actorRole: userRole,
                action: "UPDATE_GRADING_TEMPLATE",
                schoolId: userSchoolId,
                metadata: {
                    gradingId: gradingId,
                    gradingName: gradingName
                }
            })

            await client.query('COMMIT');

            return;
        } catch (error: any) {
            await client.query('ROLLBACK');
            if (error.code === '23503') throw new ConflictError("La escala seleccionada no existe");
            throw error;
        } finally {
            client.release();
        }
    }
}