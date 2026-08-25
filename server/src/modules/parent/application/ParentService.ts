import type { IParentRepository } from "../domain/IParentRepository.js";
import type { AuthUser, ParentCredentials } from "../../shared/domain/Shared.types.js";
import { UnauthorizedError, ValidationError } from "../../errors/domain/CustomErrors.js";
import type { Parent, RelationTypes } from "../domain/Parent.types.js";

export class ParentService {
    constructor(private readonly parentRepository: IParentRepository) {}

    async getParents(userSchoolId: string): Promise<Parent[]> {
        if (!userSchoolId) throw new UnauthorizedError("Faltan credenciales del usuario (master)");

        return await this.parentRepository.getParents(userSchoolId);
    }

    async createParent(parentCredentials: ParentCredentials, authUser: AuthUser): Promise<void> {
        if (!authUser.userSchoolId || !authUser.userRole || !authUser.userId) throw new UnauthorizedError("Faltan credenciales del usuario (master)");
        if (
            !parentCredentials.email ||
            !parentCredentials.firstName ||
            !parentCredentials.firstLastName ||
            !parentCredentials.password) throw new ValidationError("Faltan campos obligatorios del formulario");

        return await this.parentRepository.createParent(parentCredentials, authUser);
    }

    async linkedParentToStudent(parentId: string, studentId: string, type: RelationTypes, authUser: AuthUser): Promise<void> {
        if (!parentId || !studentId || !type) throw new ValidationError("Faltan campos obligatorios del formulario");
        if (!authUser.userSchoolId || !authUser.userRole || !authUser.userId) throw new UnauthorizedError("Faltan credenciales del usuario (master)");

        return await this.parentRepository.linkedParentToStudent(parentId, studentId, type, authUser);
    }

    async deleteParent(parentId: string, authUser: AuthUser): Promise<void> {
        if (!authUser.userSchoolId || !authUser.userRole || !authUser.userId) throw new UnauthorizedError("Faltan credenciales del usuario (master)");
        if (!parentId) throw new ValidationError("El id del acudiente no existe");

        return await this.parentRepository.deleteParent(parentId, authUser);
    }
}