import type { IAssignmentRepository } from "../domain/IAssignmentRepository.js";
import type {AssignmentsOverview, UpdateAssignmentDTO} from "../domain/Assignment.types.js";
import { pool } from "../../../db/index.js";
import { createAuditLog } from "../../../services/audit.service.js";
import { ConflictError, NotFoundError, ValidationError } from "../../errors/domain/CustomErrors.js";

export class PostgresAssignmentRepository implements IAssignmentRepository {
    async getAssignmentsOverview(courseId: string, classId: string, userSchoolId: string): Promise<AssignmentsOverview> {
        const client = await pool.connect();
        try {
            const ownershipCheck = await client.query(`
                SELECT 1 FROM course WHERE id = $1 AND school_id = $2
            `, [courseId, userSchoolId]);

            if (ownershipCheck.rowCount === 0) throw new NotFoundError("Curso no encontrado o sin acceso");

            const assessments = await client.query(`
                SELECT
                    ac.id,
                    ac.name,
                    ac.weight::float AS weight
                FROM assessment_criteria ac
                JOIN subject s ON ac.grading_template_id = s.grading_template_id
                WHERE s.id = (SELECT subject_id FROM class WHERE id = $1)
                ORDER BY ac.name ASC
            `, [classId]);

            const assignments = await client.query(`
                SELECT
                    a.id,
                    a.name,
                    a.due_date,
                    a.created_at,
                    a.assessment_criteria_id
                FROM assignment a
                WHERE a.class_id = $1
                ORDER BY a.name ASC
            `, [classId]);

            const assignmentsByCriteria = new Map<string, any[]>();

            for (const asg of assignments.rows) {
                const list = assignmentsByCriteria.get(asg.assessment_criteria_id) ?? [];
                list.push({
                    id: asg.id,
                    name: asg.name,
                    due_date: asg.due_date,
                    created_at: asg.created_at
                });
                assignmentsByCriteria.set(asg.assessment_criteria_id, list);
            }

            return {
                assessment_criteria: assessments.rows.map(ac => ({
                    id: ac.id,
                    name: ac.name,
                    weight: ac.weight,
                    assignments: assignmentsByCriteria.get(ac.id) ?? []
                })),
            }
        } finally {
            client.release();
        }
    }

    async createAssignment(
        assignmentName: string,
        assignmentDueAt: string,
        classId: string,
        assessmentId: string,
        userId: string,
        userRole: string,
        userSchoolId: string): Promise<void> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const ownershipCheck = await client.query(`
                SELECT 1
                FROM class cl
                JOIN course c ON cl.course_id = c.id
                JOIN subject s ON cl.subject_id = s.id
                JOIN assessment_criteria ac ON ac.grading_template_id = s.grading_template_id
                WHERE cl.id = $1 AND ac.id = $2 AND c.school_id = $3
            `, [classId, assessmentId, userSchoolId]);

            if (ownershipCheck.rowCount === 0) throw new NotFoundError("No se puede crear la asignación: clase o criterio inválido");

            const assignment = await client.query(`
            INSERT INTO assignment (name, due_date, class_id, assessment_criteria_id)
            VALUES ($1, $2, $3, $4)
            RETURNING id
        `, [assignmentName, assignmentDueAt, classId, assessmentId]);

            await createAuditLog(client, {
                actorUserId: userId,
                actorRole: userRole,
                action: "CREATE_ASSIGNMENT",
                schoolId: userSchoolId,
                metadata: { assignmentId: assignment.rows[0].id, assignmentName: assignmentName }
            })

            await client.query('COMMIT');
            return;
        } catch (error: unknown) {
            await client.query('ROLLBACK');
            if (error instanceof Error && 'code' in error && error.code === '23503') {
                throw new ConflictError("La clase o el criterio seleccionado no existe");
            }
            throw error;
        } finally {
            client.release();
        }
    }

    async updateAssignment(
        assignmentId: string,
        payload: UpdateAssignmentDTO,
        userId: string,
        userRole: string,
        userSchoolId: string
    ): Promise<void> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const ownershipCheck = await client.query(`
                SELECT 1
                FROM assignment a
                JOIN class c ON a.class_id = c.id
                JOIN course cr ON c.course_id = cr.id
                WHERE a.id = $1
                AND cr.school_id = $2
            `, [assignmentId, userSchoolId]);

            if (ownershipCheck.rowCount === 0) throw new NotFoundError("No se puede editar la asignación: clase o criterio inválido");

            const clauses: string[] = [];
            const values: any[] = [];
            let index = 1;

            if (payload.assignmentName !== undefined) {
                clauses.push(`name = $${index++}`);
                values.push(payload.assignmentName);
            }

            if (payload.assignmentDueAt !== undefined) {
                clauses.push(`due_date = $${index++}`);
                values.push(payload.assignmentDueAt);
            }

            values.push(assignmentId);

            if (clauses.length === 0) {
                throw new ValidationError('Debe proporcionar al menos un campo para actualizar');
            }

            const query = `
                UPDATE assignment
                SET ${clauses.join(', ')}
                WHERE id = $${index}
            `

            await client.query(query, values);

            await createAuditLog(client, {
                actorUserId: userId,
                actorRole: userRole,
                action: "UPDATE_ASSIGNMENT",
                schoolId: userSchoolId,
                metadata: { assignmentId: assignmentId, assignmentFields: payload }
            })

            await client.query('COMMIT');
            return;
        } catch (error: unknown) {
            await client.query('ROLLBACK');
            if (error instanceof Error && 'code' in error && error.code === '23503') {
                throw new ConflictError("La clase o el criterio seleccionado no existe");
            }
            throw error;
        } finally {
            client.release();
        }
    }

    async deleteAssignment(assignmentId: string, userId: string, userRole: string, userSchoolId: string): Promise<void> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const ownershipCheck = await client.query(`
                SELECT 1
                FROM assignment a
                JOIN class c ON a.class_id = c.id
                JOIN course cr ON c.course_id = cr.id
                WHERE a.id = $1
                AND cr.school_id = $2
            `, [assignmentId, userSchoolId]);

            if (ownershipCheck.rowCount === 0) throw new NotFoundError("No se puede eliminar la asignación: clase o criterio inválido");

            const assignment = await client.query(`
                DELETE FROM assignment WHERE id = $1
                RETURNING id, name
            `, [assignmentId]);

            if (assignment.rowCount === 0) {
                throw new NotFoundError("La asignación no existe");
            }

            await createAuditLog(client, {
                actorUserId: userId,
                actorRole: userRole,
                action: "DELETE_ASSIGNMENT",
                schoolId: userSchoolId,
                metadata: { assignmentId: assignmentId, assignmentName: assignment.rows[0].name }
            })

            await client.query('COMMIT');
            return;
        } catch (error: unknown) {
            await client.query('ROLLBACK');
            if (error instanceof Error && 'code' in error && error.code === '23503') {
                throw new ConflictError("La clase o el criterio seleccionado no existe");
            }
            throw error;
        } finally {
            client.release();
        }
    }
}