import type {CreateStudent, StudentByName, StudentDetails, Students} from "./Student.types.js";
import type {StudentCreateCredentials, AuthUser, StudentUpdateCredentials} from "../../shared/domain/Shared.types.js";

export interface IStudentRepository {
    getStudents(userSchoolId: string, isActive: boolean): Promise<Students[]>;
    getStudentDetails(studentId: string, userSchoolId: string): Promise<StudentDetails | null>;
    getStudentsByName(query: string, authUser: AuthUser, limit: number): Promise<StudentByName[]>;
    createStudent(studentCredentials: StudentCreateCredentials, authUser: AuthUser): Promise<CreateStudent>;
    updateStudent(studentCredentials: StudentUpdateCredentials, authUser: AuthUser): Promise<void>;
    deleteStudent(studentId: string, userId: string, userRole: string, userSchoolId: string): Promise<void>;
}