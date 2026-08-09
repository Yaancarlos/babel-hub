import type { IAssignmentRepository } from "../domain/IAssignmentRepository.js";
import type { AssignmentsOverview } from "../domain/Assignment.types.js";
import { pool } from "../../../db/index.js";

export class PostgresAssigmentRepository implements IAssignmentRepository {
    async getAssignmentsOverview(courseId: string, classId: string, userSchoolId: string): Promise<AssignmentsOverview> {
        const client = await pool.connect();
        try {
            const students = await client.query(`
                SELECT
                    st.id,
                    p.first_name,
                    p.middle_name,
                    p.first_last_name,
                    p.second_last_name,
                    p.email
                FROM student st
                         JOIN profile p ON st.profile_id = p.id
                WHERE st.course_id = $1 AND p.is_active = true
                ORDER BY p.first_last_name ASC
            `, [courseId]);

            const assessments = await client.query(`
                SELECT
                    ac.id,
                    ac.name,
                    ac.weight::float AS weight,
                    COUNT(asg.id)::int AS assignment_count
                FROM assessment_criteria ac
                JOIN subject s ON ac.grading_template_id = s.grading_template_id
                LEFT JOIN assignment asg ON ac.id = asg.assessment_criteria_id AND asg.class_id = $1
                WHERE s.id = (SELECT subject_id FROM class WHERE id = $1)
                GROUP BY ac.id, ac.name, ac.weight
                ORDER BY ac.name ASC
            `, [classId]);

            return {
                students: students.rows,
                assessment_criteria: assessments.rows,
            }
        } finally {
            client.release();
        }
    }
}