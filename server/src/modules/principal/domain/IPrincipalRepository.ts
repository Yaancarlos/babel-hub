import type { CreatePrincipal } from "./Principal.types.js";

export interface IPrincipalRepository {
    createPrincipal(
        principalEmail: string,
        principalPassword: string,
        principalFirstName: string,
        principalMiddleName: string | null | undefined,
        principalFirstLastName: string,
        principalSecondLastName: string | null | undefined,
        userId: string,
        userRole: string,
        userSchoolId: string
    ): Promise<CreatePrincipal>;
}