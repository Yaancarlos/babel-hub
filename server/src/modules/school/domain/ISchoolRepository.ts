import type {CreateSchool} from "./School.types.js";

export interface ISchoolRepository {
    createSchool(schoolName: string,
                 principalFirstName: string,
                 principalMiddleName: string | null | undefined,
                 principalFirstLastName: string,
                 principalSecondLastName: string | null | undefined,
                 principalEmail: string,
                 principalPassword: string,
                 userId: string,
                 userRole: string,
                 userSchoolId: string): Promise<CreateSchool>;
}