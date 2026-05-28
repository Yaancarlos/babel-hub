import type { ISubjectsRepository } from "../domain/ISubjectsRepository.js";
import type { AvailableSubjects, CreateSubject, SubjectDetails } from "../domain/Subjects.types.js";
import { pool } from "../../../db/index.js";
import { createAuditLog } from "../../../services/audit.service.js";
import {ConflictError, NotFoundError} from "../../errors/domain/CustomErrors.js";

export class PostgresSubjectRepository implements ISubjectsRepository {

    async getSubjectsByArea(subjectAreaId:string, userSchoolId:string): Promise<SubjectDetails[]> {
        const client = await pool.connect();
        try {
            const result = await client.query(`
                SELECT id, name, area_id 
                FROM subjects 
                WHERE area_id = $1 AND school_id = $2
                ORDER BY name ASC
            `, [subjectAreaId, userSchoolId]);

            return result.rows;
        } finally {
            client.release();
        }
    }

    async getAvailableSubjects(courseId: string, userSchoolId: string) {
        const client = await pool.connect();
        try {
            const subjects = await client.query<AvailableSubjects>(`
                SELECT 
                    id, 
                    name 
                FROM subjects 
                WHERE school_id = $1
                AND id NOT IN (
                    SELECT 
                        subject_id 
                    FROM classes 
                    WHERE course_id = $2
                )
                ORDER BY name ASC;
            `, [userSchoolId, courseId]);

            return subjects.rows;
        } finally {
            client.release();
        }
    }

    async createSubject(subjectName: string, subjectAreaId: string, userId: string, userRole: string, userSchoolId: string): Promise<CreateSubject> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const result = await client.query(`
                INSERT INTO subjects (school_id, name, area_id)
                VALUES ($1, $2, $3)
                RETURNING id
            `, [userSchoolId, subjectName, subjectAreaId]);

            const subjectId = result.rows[0].id;

            await createAuditLog(client, {
                actorUserId: userId,
                actorRole: userRole,
                action: "CREATE_SUBJECT",
                schoolId: userSchoolId,
                metadata: {
                    subjectId: subjectId,
                    name: subjectName,
                    area: subjectAreaId,
                }
            });

            await client.query('COMMIT');

            return { id: subjectId };
        } catch (error : any) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async updateSubject(subjectId: string, subjectName: string, subjectAreaId: string, userId: string, userRole: string, userSchoolId: string): Promise<void> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const result = await client.query(`
                UPDATE subjects 
                SET name = $1, area_id = $2 
                WHERE id = $3 AND school_id = $4
            `, [subjectName, subjectAreaId, subjectId, userSchoolId]);

            if (result.rowCount === 0) throw new NotFoundError("No se encontro la asignatura para su actualización");

            await createAuditLog(client, {
                actorUserId: userId,
                actorRole: userRole,
                action: "UPDATE_SUBJECT",
                schoolId: userSchoolId,
                metadata: { subjectId, newName: subjectName, newAreaId: subjectAreaId }
            });

            await client.query('COMMIT');

            return;
        } catch (error : any) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async deleteSubject(subjectId: string, userId: string, userRole: string, userSchoolId: string): Promise<void> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const subjectCheck = await client.query(`
                SELECT 1
                FROM subjects
                WHERE id = $1 AND school_id = $2
            `, [subjectId, userSchoolId]);

            if (subjectCheck.rowCount === 0) throw new NotFoundError("No se encontro la asignatura para su eliminación");

            const result = await client.query(`
                DELETE FROM subjects 
                WHERE id = $1 AND school_id = $2
                RETURNING id, name
            `, [subjectId, userSchoolId]);

            await createAuditLog(client, {
                actorUserId: userId,
                actorRole: userRole,
                action: "DELETE_SUBJECT",
                schoolId: userSchoolId,
                metadata: { subjectId, name: result.rows[0].name }
            });

            await client.query('COMMIT');

            return;
        } catch (error : any) {
            await client.query('ROLLBACK');

            if (error.code === '23503') {
                throw new ConflictError("No se puede eliminar por que la asignatura esta asignada a clases activas");
            }

            throw error;
        } finally {
            client.release();
        }
    }
}