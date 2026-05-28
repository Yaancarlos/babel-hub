import type { CreatePrincipal } from "./Principal.types.js";

export interface IPrincipalRepository {
    createPrincipal(principalEmail: string, principalPassword: string, principalName: string, userId: string, userRole: string, userSchoolId: string): Promise<CreatePrincipal>;
}