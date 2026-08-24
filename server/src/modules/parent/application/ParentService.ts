import type { IParentRepository } from "../domain/IParentRepository.js";
import type { AuthUser, ParentCredentials } from "../../shared/domain/Shared.types.js";
import { UnauthorizedError, ValidationError } from "../../errors/domain/CustomErrors.js";

export class ParentService {
    constructor(private readonly parentRepository: IParentRepository) {}

    async createParent(
        parentCredentials: ParentCredentials,
        authUser: AuthUser
    ): Promise<void> {
        if (!authUser.userSchoolId || !authUser.userRole || !authUser.userId) throw new UnauthorizedError("Faltan credenciales del usuario (master)");
        if (
            !parentCredentials.email ||
            !parentCredentials.firstName ||
            !parentCredentials.firstLastName ||
            !parentCredentials.password) throw new ValidationError("Faltan campos obligatorios del formulario");

        return await this.parentRepository.createParent(parentCredentials, authUser);
    }
}