import type { IParentRepository } from "../domain/IParentRepository.js";
import type { ParentCredentials, AuthUser } from "../../shared/domain/Shared.types.js";
import { pool } from "../../../db/index.js";
import { supabase } from "../../../services/index.js";
import { ConflictError, NotFoundError, ValidationError} from "../../errors/domain/CustomErrors.js";
import { createAuditLog} from "../../../services/audit.service.js";
import type {ClassFinalGrade, Parent, ParentStudent, RelationTypes} from "../domain/Parent.types.js";

export class PostgresParentRepository implements IParentRepository {
    async getParents(userSchoolId: string): Promise<Parent[]> {
        const client = await pool.connect();
        try {
            const parents = await client.query(`
                SELECT
                    p.id AS parent_id,
                    pr.id AS profile_id,
                    pr.first_name AS parent_first_name,
                    pr.middle_name AS parent_middle_name,
                    pr.first_last_name AS parent_first_last_name,
                    pr.second_last_name AS parent_second_last_name,
                    pr.email,
                    pr.is_active,
                    pr.created_at,
                    COUNT(ps.student_id)::int AS students_count,
                    COALESCE(
                            json_agg(
                                    json_build_object(
                                            'student_id', s.id,
                                            'student_first_name', spr.first_name,
                                            'student_middle_name', spr.middle_name,
                                            'student_first_last_name', spr.first_last_name,
                                            'student_second_last_name', spr.second_last_name,
                                            'relationship_type', ps.relationship_type
                                    ) ORDER BY spr.first_last_name ASC
                            ) FILTER (WHERE s.id IS NOT NULL),
                            '[]'::json
                    ) AS students
                FROM parent p
                JOIN profile pr ON p.profile_id = pr.id
                LEFT JOIN parent_student ps ON p.id = ps.parent_id
                LEFT JOIN student s ON ps.student_id = s.id
                LEFT JOIN profile spr ON s.profile_id = spr.id
                WHERE pr.school_id = $1 AND pr.is_active = true
                GROUP BY
                    p.id,
                    pr.id
                ORDER BY pr.first_last_name ASC;
            `, [userSchoolId]);

            return parents.rows;
        } finally {
            client.release();
        }
    }

    async getParentStudents(authUser: AuthUser): Promise<ParentStudent[]> {
        const client = await pool.connect();
        try {
            const check = await client.query(`
                SELECT 1
                FROM parent p
                WHERE p.profile_id = $1
            `, [authUser.userId]);

            if (check.rowCount === 0) throw new NotFoundError("El acudiente no fue encontrado");

            const result = await client.query(`
                SELECT
                    s.id AS student_id,
                    pr.first_name AS student_first_name,
                    pr.middle_name AS student_middle_name,
                    pr.first_last_name AS student_first_last_name,
                    pr.second_last_name AS student_second_last_name,
                    ps.relationship_type,
                    c.id AS course_id,
                    c.name AS course_name
                FROM parent p
                JOIN parent_student ps ON p.id = ps.parent_id
                JOIN student s ON ps.student_id = s.id
                JOIN profile pr ON s.profile_id = pr.id
                JOIN course c ON s.course_id = c.id
                WHERE p.profile_id = $1
                  AND pr.school_id = $2
                  AND pr.is_active = true
            `, [authUser.userId, authUser.userSchoolId]);

            return result.rows;
        } finally {
            client.release();
        }
    }

    async getStudentGrades(studentId: string): Promise<ClassFinalGrade[]> {
        const client = await pool.connect();
        try {
            const result = await client.query(`
                WITH CriteriaAverages AS (
                    SELECT
                        c.id AS class_id,
                        sub.name AS subject_name,
                        ac.id AS criteria_id,
                        ac.weight,
                        AVG(g.value) AS criteria_avg,
                        sc.max_value,
                        sc.min_value,
                        sc.passing_value
                    FROM student s
                    JOIN class c ON s.course_id = c.course_id
                    JOIN subject sub ON c.subject_id = sub.id
                    JOIN grading_template gt ON sub.grading_template_id = gt.id
                    JOIN scale sc ON gt.scale_id = sc.id
                    JOIN assessment_criteria ac ON gt.id = ac.grading_template_id
                    LEFT JOIN assignment a ON c.id = a.class_id AND a.assessment_criteria_id = ac.id
                    LEFT JOIN grade g ON a.id = g.assignment_id AND g.student_id = s.id
                    WHERE s.id = $1
                    GROUP BY c.id, sub.name, ac.id, ac.weight, sc.max_value, sc.min_value, sc.passing_value
                )
                SELECT
                    class_id,
                    subject_name,
                    COALESCE(ROUND(SUM(criteria_avg * (weight / 100.0)), 2)::float, 0) AS final_grade,
                    max_value AS scale_max,
                    min_value AS scale_min,
                    passing_value
                FROM CriteriaAverages
                GROUP BY class_id, subject_name, max_value, min_value, passing_value
                ORDER BY subject_name ASC;
            `, [studentId]);

            return result.rows;
        } finally {
            client.release();
        }
    }

    async createParent(parentCredentials:ParentCredentials, authUser:AuthUser): Promise<void> {
        const client = await pool.connect();
        let authUserId: string | null = null;
        try {
            await client.query('BEGIN');

            const { data, error } = await supabase.auth.admin.createUser({
                email: parentCredentials.email,
                password: parentCredentials.password,
                email_confirm: true
            })

            if (error) {
                if (error.code === 'email_exists') {
                    throw new ConflictError("Ya existe un usuario con la misma dirrecion de email");
                }

                throw new ValidationError(`No se pudo crear el usuario (${error.message})`);
            }

            authUserId = data.user?.id as string;

            const profile = await client.query(`
                INSERT INTO profile (auth_profile_id, first_name, middle_name, first_last_name, second_last_name, role, email, school_id)
                VALUES ($1, $2, $3, $4, $5, 'parent', $6, $7)
                RETURNING id;
            `, [authUserId, parentCredentials.firstName, parentCredentials.middleName, parentCredentials.firstLastName, parentCredentials.secondLastName, parentCredentials.email, authUser.userSchoolId]);

            const profileId = profile.rows[0].id;

            const parent = await client.query(`INSERT INTO parent (profile_id) VALUES ($1) RETURNING id`, [profileId]);

            const parentId = parent.rows[0].id;

            await createAuditLog(client, {
                targetUserId: profileId,
                actorUserId: authUser.userId,
                actorRole: authUser.userRole,
                action: "CREATE_PARENT",
                schoolId: authUser.userSchoolId,
                metadata: {
                    name: [parentCredentials.firstName, parentCredentials.middleName ?? "", parentCredentials.firstLastName, parentCredentials.secondLastName ?? ""].join(" "),
                    email: parentCredentials.email
                }
            })

            await client.query('COMMIT');
        } catch (error : any) {
            let rolledBack = true;
            try {
                await client.query('ROLLBACK');
            } catch (rollbackError) {
                rolledBack = false;
                console.error('Rollback failed, DB state uncertain:', rollbackError);
            }

            if (authUserId) {
                if (rolledBack) {
                    try {
                        console.warn(`[Error]: Eliminando usuario huérfano de Supabase: ${authUserId}`);
                        await supabase.auth.admin.deleteUser(authUserId);
                    } catch (supabaseCleanupError) {
                        console.error(`Failed to delete orphaned Supabase user ${authUserId}:`, supabaseCleanupError);
                    }
                } else {
                    console.error(`Uncertain state for authUserId=${authUserId}, profile may or may not exist. Manual reconciliation needed.`);
                }
            }

            if (error.code === '23505') {
                throw new ConflictError('Ese email ya esta tomado, intenta usar otro');
            }

            throw error;
        } finally {
            client.release();
        }
    }

    async linkedParentToStudent(parentId: string, studentId: string, type: RelationTypes, authUser: AuthUser): Promise<void> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const check = await client.query(`
                SELECT 1
                FROM parent pa
                JOIN profile pp ON pa.profile_id = pp.id
                JOIN student st ON st.id = $2
                JOIN profile sp ON st.profile_id = sp.id
                WHERE pa.id = $1 AND pp.school_id = $3 AND sp.school_id = $3
            `, [parentId, studentId, authUser.userSchoolId]);

            if (check.rowCount === 0) throw new NotFoundError("Padre o estudiante no encontrado");

            await client.query(`
                INSERT INTO parent_student (parent_id, student_id, relationship_type)
                VALUES ($1, $2, $3)
            `, [parentId, studentId, type]);

            await createAuditLog(client, {
                actorUserId: authUser.userId,
                actorRole: authUser.userRole,
                action: "LINK_PARENT_STUDENT",
                schoolId: authUser.userSchoolId,
                metadata: {
                    parentId,
                    studentId,
                    relationType: type
                }
            });


            await client.query('COMMIT');
            return;
        } catch (error : any) {
            await client.query('ROLLBACK');
            if (error.code === '23505') throw new ConflictError("Este padre ya está vinculado a este estudiante");
            if (error.code === '23503') throw new ConflictError("Padre o estudiante inválido");
            throw error;
        } finally {
            client.release();
        }
    }

    async deleteParent(parentId: string, authUser: AuthUser): Promise<void> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const parentCheck = await client.query(`
                SELECT 
                    p.profile_id, 
                    pr.auth_profile_id,
                    pr.first_name as parent_first_name,
                    pr.middle_name as parent_middle_name,
                    pr.first_last_name as parent_first_last_name,
                    pr.second_last_name as parent_second_last_name
                FROM parent p
                JOIN profile pr ON p.profile_id = pr.id
                WHERE p.id = $1 AND pr.school_id = $2
            `, [parentId, authUser.userSchoolId]);

            if (parentCheck.rowCount === 0) throw new NotFoundError("El estudiente no se encontro para su eliminación");

            const {
                profile_id,
                auth_profile_id,
                parent_first_name,
                parent_middle_name,
                parent_first_last_name,
                parent_second_last_name,
            } = parentCheck.rows[0];

            await client.query(`DELETE FROM parent WHERE id = $1`, [parentId]);
            await client.query(`DELETE FROM profile WHERE id = $1`, [profile_id]);
            const { error } = await supabase.auth.admin.deleteUser(auth_profile_id);

            if (error) throw new ValidationError(`No se pudo eliminar el usuario (${error.message})`);

            await createAuditLog(client, {
                actorUserId: authUser.userId,
                actorRole: authUser.userRole,
                action: 'DELETE_PARENT',
                schoolId: authUser.userSchoolId,
                metadata: {
                    parentId,
                    name: [parent_first_name, parent_middle_name ?? "", parent_first_last_name, parent_second_last_name ?? ""].join(" ")
                }
            });

            await client.query('COMMIT');

            return;
        } catch (error : any) {
            let rolledBack = true;
            try {
                await client.query('ROLLBACK');
            } catch (rollbackError) {
                rolledBack = false;
                console.error('[CRITICAL] Rollback failed during parent deletion, DB state uncertain:', rollbackError);
            }

            if (!rolledBack) {
                console.error(`[CRITICAL] Uncertain state deleting parent, profile_id may still exist while Supabase user was deleted. Manual reconciliation needed.`);
            }

            if (error.code === '23503') throw new ConflictError("No se puede eliminar el acudiente porque tiene información guardada.");

            throw error;
        } finally {
            client.release();
        }
    }
}