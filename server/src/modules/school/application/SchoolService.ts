import type { ISchoolRepository } from "../domain/ISchoolRepository.js";
import type { CreateSchool } from "../domain/School.types.js";
import { UnauthorizedError, ValidationError } from "../../errors/domain/CustomErrors.js";


export class SchoolService {
    constructor( private readonly schoolRepository: ISchoolRepository) {}

    async createSchool(schoolName: string,
                       principalFirstName: string,
                       principalMiddleName: string | null | undefined,
                       principalFirstLastName: string,
                       principalSecondLastName: string | null | undefined,
                       principalEmail: string,
                       principalPassword: string,
                       userId: string,
                       userRole: string,
                       userSchoolId: string): Promise<CreateSchool> {
        if (!userId || !userRole || !userSchoolId) throw new UnauthorizedError("Faltan credenciales del usuario (master)");
        if (!schoolName ||
            !principalEmail ||
            !principalFirstName ||
            !principalFirstLastName ||
            !principalPassword
        ) throw new ValidationError("Todos los campos deben estar llenos");

        return await this.schoolRepository.createSchool(
            schoolName,
            principalFirstName,
            principalMiddleName ?? null,
            principalFirstLastName,
            principalSecondLastName ?? null,
            principalEmail,
            principalPassword,
            userId,
            userRole,
            userSchoolId);
    }

}