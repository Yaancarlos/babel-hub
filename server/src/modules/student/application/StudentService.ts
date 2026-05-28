import type { IStudentRepository } from "../domain/IStudentRepository.js";
import type { CreateStudent, StudentDetails, Students } from "../domain/Student.types.js";
import { NotFoundError, UnauthorizedError, ValidationError } from "../../errors/domain/CustomErrors.js";

export class StudentService {
    constructor( private readonly studentService: IStudentRepository ) {}

    async getStudents(userSchoolId: string): Promise<Students[]> {
        if (!userSchoolId) throw new UnauthorizedError("Faltan credenciales del usuario (master)");

        return await this.studentService.getStudents(userSchoolId);
    }

    async getStudentDetails(studentId: string, userSchoolId: string): Promise<StudentDetails> {
        if (!userSchoolId) throw new UnauthorizedError("Faltan credenciales del usuario (master)");
        if (!studentId) throw new ValidationError("El ID del estudiante es obligatorio");

        const student = await this.studentService.getStudentDetails(studentId, userSchoolId);

        if (!student) throw new NotFoundError("El estudiante no existe");
        return student;
    }

    async createStudent(courseId: string, studentName: string, studentEmail: string, studentPassword: string, studentEnrolmentCode: string, userId: string, userRole: string, userSchoolId: string): Promise<CreateStudent> {
        if (!courseId || !studentEmail || !studentPassword || !studentEnrolmentCode || !studentName) throw new ValidationError("Faltan campos obligatorios");
        if (!userId || !userRole || !userSchoolId) throw new UnauthorizedError("Faltan credenciales del usuario (master)");

        return await this.studentService.createStudent(courseId, studentName, studentEmail, studentPassword, studentEnrolmentCode, userId, userRole, userSchoolId);
    }

    async updateStudent(studentId: string, courseId: string, studentName: string, studentEnrolmentCode: string, userId: string, userRole: string, userSchoolId: string): Promise<void> {
        if (!userId || !userRole || !userSchoolId) throw new UnauthorizedError("Faltan credenciales del usuario (master)");
        if (!courseId || !studentEnrolmentCode || !studentName) throw new ValidationError("Faltan campos obligatorios");

        return await this.studentService.updateStudent(studentId, courseId, studentName, studentEnrolmentCode, userId, userRole, userSchoolId);
    }

    async deleteStudent(studentId: string, userId: string, userRole: string, userSchoolId: string): Promise<void> {
        if (!userId || !userRole || !userSchoolId) throw new UnauthorizedError("Faltan credenciales del usuario (master)");
        if (!studentId) throw new ValidationError("El ID del estudiante es obligatorio");

        return await this.studentService.deleteStudent(studentId, userId, userRole, userSchoolId);
    }
}