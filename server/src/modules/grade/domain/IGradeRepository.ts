import type { AuthUser } from "../../shared/domain/Shared.types.js";
import type {GradeByAssignment, GradeRecord, StudentGrade, ValidScales} from "./Grade.types.js";

export interface IGradeRepository {
    getGradesByClass(classId: string): Promise<GradeByAssignment[]>;
    getStudentGrades(studentId: string, periodId: string): Promise<StudentGrade[]>;
    bulkUpsertGrades(assignmentId: string, records: GradeRecord[], authUser: AuthUser): Promise<void>;
}