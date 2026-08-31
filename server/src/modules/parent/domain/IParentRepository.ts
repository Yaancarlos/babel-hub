import type { AuthUser, ParentCredentials } from "../../shared/domain/Shared.types.js";
import type {ClassFinalGrade, Parent, ParentStudent, RelationTypes} from "./Parent.types.js";

export interface IParentRepository {
    getParents(userSchoolId: string): Promise<Parent[]>;
    getParentStudents(authUser: AuthUser): Promise<ParentStudent[]>;
    getStudentGrades(studentId: string): Promise<ClassFinalGrade[]>;
    createParent(parentCredentials: ParentCredentials, authUser: AuthUser): Promise<void>;
    linkedParentToStudent(parentId: string, studentId: string, type: RelationTypes, authUser: AuthUser): Promise<void>;
    deleteParent(parentId: string, authUser: AuthUser): Promise<void>;
}