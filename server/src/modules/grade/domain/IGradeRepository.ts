import type { AuthUser } from "../../shared/domain/Shared.types.js";
import type { GradeByAssignment, GradeRecord, ValidScales } from "./Grade.types.js";

export interface IGradeRepository {
    getGradesByClass(classId: string): Promise<GradeByAssignment[]>;
    bulkUpsertGrades(assignmentId: string, records: GradeRecord[], authUser: AuthUser): Promise<void>;
}