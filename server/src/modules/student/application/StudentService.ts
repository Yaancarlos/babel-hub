import type { IStudentRepository } from "../domain/IStudentRepository.js";
import type { CreateStudent, StudentByName, StudentDetails, Students } from "../domain/Student.types.js";
import { NotFoundError, UnauthorizedError, ValidationError } from "../../errors/domain/CustomErrors.js";
import type { AuthUser, StudentCreateCredentials, StudentUpdateCredentials } from "../../shared/domain/Shared.types.js";

export class StudentService {
    constructor( private readonly studentService: IStudentRepository ) {}

    async getStudents(userSchoolId: string, isActive: boolean): Promise<Students[]> {
        if (!userSchoolId) throw new UnauthorizedError("Faltan credenciales del usuario (master)");

        return await this.studentService.getStudents(userSchoolId, isActive);
    }

    async getStudentDetails(studentId: string, userSchoolId: string): Promise<StudentDetails> {
        if (!userSchoolId) throw new UnauthorizedError("Faltan credenciales del usuario (master)");
        if (!studentId) throw new ValidationError("El ID del estudiante es obligatorio");

        const student = await this.studentService.getStudentDetails(studentId, userSchoolId);

        if (!student) throw new NotFoundError("El estudiante no existe");
        return student;
    }

    async getStudentsByName(query: string, authUser: AuthUser, limit: number): Promise<StudentByName[]> {
        if (!authUser.userSchoolId) throw new UnauthorizedError("Faltan credenciales del usuario");

        return this.studentService.getStudentsByName(query, authUser, limit);
    }

    async createStudent(studentCredentials: StudentCreateCredentials, authUser: AuthUser): Promise<CreateStudent> {
        if (!studentCredentials.courseId ||
            !studentCredentials.email ||
            !studentCredentials.password ||
            !studentCredentials.firstName ||
            !studentCredentials.firstLastName
        ) throw new ValidationError("Faltan campos obligatorios");
        if (!authUser.userId || !authUser.userRole || !authUser.userSchoolId) throw new UnauthorizedError("Faltan credenciales del usuario (master)");

        return await this.studentService.createStudent(studentCredentials, authUser);
    }

    async updateStudent(studentCredentials: StudentUpdateCredentials, authUser: AuthUser): Promise<void> {
        if (!authUser.userId || !authUser.userRole || !authUser.userSchoolId) throw new UnauthorizedError("Faltan credenciales del usuario (master)");
        if (!studentCredentials.courseId ||
            !studentCredentials.firstName ||
            !studentCredentials.firstLastName
        ) throw new ValidationError("Faltan campos obligatorios");

        return await this.studentService.updateStudent(studentCredentials, authUser);
    }

    async deleteStudent(studentId: string, userId: string, userRole: string, userSchoolId: string): Promise<void> {
        if (!userId || !userRole || !userSchoolId) throw new UnauthorizedError("Faltan credenciales del usuario (master)");
        if (!studentId) throw new ValidationError("El ID del estudiante es obligatorio");

        return await this.studentService.deleteStudent(studentId, userId, userRole, userSchoolId);
    }
}