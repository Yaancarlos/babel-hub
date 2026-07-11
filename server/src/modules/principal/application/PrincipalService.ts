import type { IPrincipalRepository } from "../domain/IPrincipalRepository.js";
import type { CreatePrincipal } from "../domain/Principal.types.js";
import { UnauthorizedError, ValidationError } from "../../errors/domain/CustomErrors.js";

export class PrincipalService {
    constructor(private readonly principalRepository: IPrincipalRepository) {}

    async createPrincipal(
        principalEmail: string,
        principalPassword: string,
        principalFirstName: string,
        principalMiddleName: string,
        principalFirstLastName: string,
        principalSecondLastName: string,
        userId: string,
        userRole: string,
        userSchoolId: string
    ): Promise<CreatePrincipal> {
        if (!userId || !userRole || !userSchoolId) throw new UnauthorizedError("Faltan credenciales del usuario (master)");
        if (!principalEmail ||
            !principalFirstName ||
            !principalMiddleName ||
            !principalFirstLastName ||
            !principalSecondLastName ||
            !principalPassword
        ) throw new ValidationError("Todos los campos deben estar llenos");

        return await this.principalRepository.createPrincipal(
            principalEmail,
            principalPassword,
            principalFirstName,
            principalMiddleName,
            principalFirstLastName,
            principalSecondLastName,
            userId,
            userRole,
            userSchoolId
        );
    }
}