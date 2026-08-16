import type { IGradeRepository } from "../domain/IGradeRepository.js";
import type {GradeByAssignment, GradeRecord} from "../domain/Grade.types.js";
import type { AuthUser } from "../../shared/domain/Shared.types.js";
import { UnauthorizedError, ValidationError } from "../../errors/domain/CustomErrors.js";
import { validateGrade } from "../domain/Grade.rules.js";

export class GradeService {
    constructor( private readonly gradeRepository: IGradeRepository ) {}

    async bulkUpsertGrades(assignmentId: string, records: GradeRecord[], authUser: AuthUser): Promise<void> {
        if (!assignmentId) throw new ValidationError("El id de la asignación no esta siendo enviado");
        if (!authUser.userId || !authUser.userRole || !authUser.userSchoolId ) throw new UnauthorizedError("Faltan credenciales del usuario");
        if (!records || records.length === 0) throw new ValidationError('No hay calificaciones por guardar')

        const scales = await this.gradeRepository.getValidScales(assignmentId);

        for (const record of records) {
            if (!record.studentId || record.value === undefined || record.value === null) throw new ValidationError("Faltan campos obligatorios en una o más calificaciones");
            validateGrade(scales, record.value);
        }

        return await this.gradeRepository.bulkUpsertGrades(assignmentId, records, authUser);
    }
}