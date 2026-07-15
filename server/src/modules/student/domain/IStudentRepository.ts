import type { CreateStudent, StudentDetails, Students } from "./Student.types.js";

export interface IStudentRepository {
    getStudents(userSchoolId: string, isActive: boolean): Promise<Students[]>;
    getStudentDetails(studentId: string, userSchoolId: string): Promise<StudentDetails | null>;
    createStudent(courseId: string,
                  studentFirstName: string,
                  studentMiddleName: string | null | undefined,
                  studentFirstLastName: string,
                  studentSecondLastName: string | null | undefined,
                  studentEmail: string,
                  studentPassword: string,
                  studentEnrollmentCode: string | null | undefined,
                  userId: string,
                  userRole: string,
                  userSchoolId: string): Promise<CreateStudent>;
    updateStudent(studentId: string,
                  courseId: string,
                  studentFirstName: string,
                  studentMiddleName: string | null | undefined,
                  studentFirstLastName: string,
                  studentSecondLastName: string | null | undefined,
                  studentEnrollmentCode: string | null | undefined,
                  userId: string,
                  userRole: string,
                  userSchoolId: string): Promise<void>;
    deleteStudent(studentId: string, userId: string, userRole: string, userSchoolId: string): Promise<void>;
}