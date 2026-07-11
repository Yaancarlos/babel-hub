import type {CreateSchool} from "./School.types.js";

export interface ISchoolRepository {
    createSchool(schoolName: string,
                 principalFirstName: string,
                 principalMiddleName: string,
                 principalFirstLastName: string,
                 principalSecondLastName: string,
                 principalEmail: string,
                 principalPassword: string,
                 userId: string,
                 userRole: string,
                 userSchoolId: string): Promise<CreateSchool>;
}