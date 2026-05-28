import type { CreateStudent, StudentDetails, Students } from "./Student.types.js";

export interface IStudentRepository {
    getStudents(userSchoolId: string): Promise<Students[]>;
    getStudentDetails(studentId: string, userSchoolId: string): Promise<StudentDetails | null>;
    createStudent(courseId: string, studentName: string, studentEmail: string, studentPassword: string, studentEnrolmentCode: string, userId: string, userRole: string, userSchoolId: string): Promise<CreateStudent>;
    updateStudent(studentId: string, courseId: string, studentName: string, studentEnrolmentCode: string, userId: string, userRole: string, userSchoolId: string): Promise<void>;
    deleteStudent(studentId: string, userId: string, userRole: string, userSchoolId: string): Promise<void>;
}