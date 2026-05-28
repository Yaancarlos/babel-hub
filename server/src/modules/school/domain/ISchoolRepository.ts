import type {CreateSchool} from "./School.types.js";

export interface ISchoolRepository {
    createSchool(schoolName: string, principalName: string, principalEmail: string, principalPassword: string, userId: string, userRole: string, userSchoolId: string): Promise<CreateSchool>;
}