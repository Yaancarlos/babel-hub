export interface AuthUser {
    userId: string;
    userRole: string;
    userSchoolId: string;
}

export interface UserCredentialsForm {
    firstName: string;
    middleName: string | null | undefined;
    firstLastName: string;
    secondLastName: string | null | undefined;
    password: string;
    email: string;
}

export interface ParentCredentials extends UserCredentialsForm {}