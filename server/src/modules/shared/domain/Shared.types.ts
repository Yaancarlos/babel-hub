export interface AuthUser {
    userId: string;
    userRole: string;
    userSchoolId: string;
}

export interface BaseUserProfile {
    firstName: string;
    middleName: string | null | undefined;
    firstLastName: string;
    secondLastName: string | null | undefined;
}

export interface UserCredentialsForm extends BaseUserProfile {
    password: string;
    email: string;
}

export interface ParentCredentials extends UserCredentialsForm {}

export interface StudentCreateCredentials extends UserCredentialsForm {
    enrollmentCode: string | null | undefined;
    courseId: string;
}

export interface StudentUpdateCredentials extends BaseUserProfile {
    studentId: string;
    courseId: string;
    enrollmentCode: string | null | undefined;
}