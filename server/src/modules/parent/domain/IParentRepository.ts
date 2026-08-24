import type { AuthUser, ParentCredentials } from "../../shared/domain/Shared.types.js";

export interface IParentRepository {
    createParent(
        parentCredentials: ParentCredentials,
        authUser: AuthUser): Promise<void>;
}