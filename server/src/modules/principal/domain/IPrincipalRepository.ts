import type { CreatePrincipal } from "./Principal.types.js";

export interface IPrincipalRepository {
    createPrincipal(
        principalEmail: string,
        principalPassword: string,
        principalFirstName: string,
        principalMiddleName: string,
        principalFirstLastName: string,
        principalSecondLastName: string,
        userId: string,
        userRole: string,
        userSchoolId: string
    ): Promise<CreatePrincipal>;
}