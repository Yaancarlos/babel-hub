import type { AuthUser, ParentCredentials } from "../../shared/domain/Shared.types.js";
import type { Parent, RelationTypes } from "./Parent.types.js";

export interface IParentRepository {
    getParents(userSchoolId: string): Promise<Parent[]>;
    createParent(parentCredentials: ParentCredentials, authUser: AuthUser): Promise<void>;
    linkedParentToStudent(parentId: string, studentId: string, type: RelationTypes, authUser: AuthUser): Promise<void>;
    deleteParent(parentId: string, authUser: AuthUser): Promise<void>;
}