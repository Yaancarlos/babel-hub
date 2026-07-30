import type { IAssessmentRepository } from "../domain/IAssessmentRepository.js";
import type { Assessment } from "../domain/Assessment.types.js";
import { pool } from "../../../db/index.js";
import { createAuditLog } from "../../../services/audit.service.js";
import { ConflictError } from "../../errors/domain/CustomErrors.js";

export class PostgresAssessmentRepository implements IAssessmentRepository {
    async getAssessments(userSchoolId: string): Promise<Assessment[]> {
        const client = await pool.connect();
        try {
            const result = await client.query(`
            SELECT
                a.id,
                a.name,
                a.weight,
                a.grading_template_id
            FROM assessment_criteria a
            JOIN grading_template g ON a.grading_template_id = g.id
            WHERE g.school_id = $1
        `, [userSchoolId]);

            return result.rows;
        } finally {
            client.release();
        }
    }

    async createAssessment(assessmentName: string, assessmentWeight: number, gradingTemplateId: string, userId: string, userRole: string, userSchoolId: string): Promise<void> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const assessment = await client.query(`
            INSERT INTO assessment_criteria (name, weight, grading_template_id)
            VALUES ($1, $2, $3)
            RETURNING id
        `, [assessmentName, assessmentWeight, gradingTemplateId]);

            const assessmentId = assessment.rows[0].id;

            await createAuditLog(client, {
                actorUserId: userId,
                actorRole: userRole,
                action: "CREATE_ASSESSMENT",
                schoolId: userSchoolId,
                metadata: { assessmentId: assessmentId, assessmentName: assessmentName }
            });

            await client.query('COMMIT');
            return;
        } catch (error : any) {
            await client.query('ROLLBACK');
            if (error.code === '23503') throw new ConflictError("El template de notas seleccionado no existe");
            throw error;
        } finally {
            client.release()
        }
    }

    async updateAssessment(assessmentId: string, assessmentName: string, assessmentWeight: number, gradingTemplateId: string, userId: string, userRole: string, userSchoolId: string): Promise<void> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const checkAssessment = await client.query(`
            SELECT 1
            FROM assessment_criteria a
            JOIN grading_template g ON a.grading_template_id = g.id
            WHERE g.school_id = $1
            AND a.grading_template_id = $2
            AND a.id = $3
        `, [userSchoolId, gradingTemplateId, assessmentId]);

            if (checkAssessment.rowCount === 0) throw new ConflictError("Assessment no existe");

            await client.query(`
            UPDATE assessment_criteria
            SET name = $1, weight = $2, grading_template_id = $3
            WHERE id = $4
        `, [assessmentName, assessmentWeight, gradingTemplateId, assessmentId]);

            await createAuditLog(client, {
                actorUserId: userId,
                actorRole: userRole,
                action: "UPDATE_ASSESSMENT",
                schoolId: userSchoolId,
                metadata: { assessmentId: assessmentId, assessmentName: assessmentName }
            })

            await client.query('COMMIT');
            return;
        } catch (error : any) {
            await client.query('ROLLBACK');
            if (error.code === '23503') throw new ConflictError("El template de notas seleccionado no existe");
            throw error;
        } finally {
            client.release()
        }
    }

    async deleteAssessment(assessmentId: string, userId: string, userRole: string, userSchoolId: string): Promise<void> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const checkAssessment = await client.query(`
            SELECT 1
            FROM assessment_criteria a
            JOIN grading_template g ON a.grading_template_id = g.id
            WHERE g.school_id = $1
            AND a.id = $2
        `, [userSchoolId, assessmentId]);

            if (checkAssessment.rowCount === 0) throw new ConflictError("Assessment no existe");

            await client.query(`
            DELETE FROM assessment_criteria
            WHERE id = $1
        `, [assessmentId]);

            await createAuditLog(client, {
                actorUserId: userId,
                actorRole: userRole,
                action: "DELETE_ASSESSMENT",
                schoolId: userSchoolId,
                metadata: { assessmentId: assessmentId }
            })

            await client.query('COMMIT');
            return;
        } catch (error : any) {
            await client.query('ROLLBACK');
            if (error.code === '23503') throw new ConflictError("No se puede eliminar el criterio porque tiene tareas asignadas");
            throw error;
        } finally {
            client.release()
        }
    }
}