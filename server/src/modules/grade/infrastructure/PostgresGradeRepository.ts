import type { IGradeRepository } from "../domain/IGradeRepository.js";
import type {GradeByAssignment, GradeRecord, ValidScales} from "../domain/Grade.types.js";
import type { AuthUser } from "../../shared/domain/Shared.types.js";
import { pool } from "../../../db/index.js";
import { ConflictError, NotFoundError } from "../../errors/domain/CustomErrors.js";
import { createAuditLog } from "../../../services/audit.service.js";

export class PostgresGradeRepository implements IGradeRepository {
    async getValidScales(assignmentId: string): Promise<ValidScales> {
        const client = await pool.connect();
        try {
            const scale = await client.query(`
                SELECT
                    s.min_value::float AS min_value,
                    s.max_value::float AS max_value
                FROM assignment a
                JOIN assessment_criteria ac ON a.assessment_criteria_id = ac.id
                JOIN grading_template gt ON ac.grading_template_id = gt.id
                JOIN scale s ON gt.scale_id = s.id
                WHERE a.id = $1
            `, [assignmentId]);

            if (scale.rowCount === 0) throw new NotFoundError("Asignación no encontrada");
            return scale.rows[0];
        } finally {
            client.release();
        }
    }

    async getGradesByClass(classId: string): Promise<GradeByAssignment[]> {
        const client = await pool.connect();
        try {
            const result = await client.query(`
                SELECT
                    g.id,
                    g.student_id,
                    g.assignment_id,
                    g.value::float AS value,
                    g.comment
                FROM grade g
                JOIN assignment a ON g.assignment_id = a.id
                WHERE a.class_id = $1
            `, [classId]);

            return result.rows;
        } finally {
            client.release();
        }
    }

    async bulkUpsertGrades(assignmentId: string, records: GradeRecord[], authUser: AuthUser): Promise<void> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const ownershipCheck = await client.query(`
                SELECT 1
                FROM assignment a
                JOIN class cl ON a.class_id = cl.id
                JOIN course c ON cl.course_id = c.id
                WHERE a.id = $1 AND c.school_id = $2
            `, [assignmentId, authUser.userSchoolId]);

            if (ownershipCheck.rowCount === 0) throw new NotFoundError("Asignación no encontrada o sin acceso");

            const students: string[] = records.map(record => (record.studentId));
            const values: number[] = records.map((record) => (record.value));
            const comments: (string | null)[] = records.map(record => record.comment ?? null);

            await client.query(`
                INSERT INTO grade (value, assignment_id, student_id, comment)
                SELECT unnest($1::numeric[]), $2::uuid, unnest($3::uuid[]), unnest($4::text[])
                ON CONFLICT(student_id, assignment_id)
                DO UPDATE SET value = EXCLUDED.value, comment = EXCLUDED.comment, updated_at = NOW();
            `, [values, assignmentId, students, comments]);

            await createAuditLog(client, {
                actorUserId: authUser.userId,
                actorRole: authUser.userRole,
                action: "BULK_UPSERT_GRADES",
                schoolId: authUser.userSchoolId,
                metadata: { assignmentId, studentCount: records.length }
            })

            await client.query('COMMIT');
            return;
        } catch (error : any) {
            await client.query('ROLLBACK');
            if (error.code === '23503') throw new ConflictError("Uno o más estudiantes o la asignación no existen");
            throw error;
        } finally {
            client.release();
        }
    }
}