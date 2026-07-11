import type { CreateStudent, StudentDetails, Students } from "./Student.types.js";

export interface IStudentRepository {
    getStudents(userSchoolId: string, isActive: boolean): Promise<Students[]>;
    getStudentDetails(studentId: string, userSchoolId: string): Promise<StudentDetails | null>;
    createStudent(courseId: string,
                  studentName: string,
                  studentFirstName: string,
                  studentMiddleName: string,
                  studentFirstLastName: string,
                  studentSecondLastName: string,
                  studentPassword: string,
                  studentEnrollmentCode: string,
                  userId: string,
                  userRole: string,
                  userSchoolId: string): Promise<CreateStudent>;
    updateStudent(studentId: string,
                  courseId: string,
                  studentFirstName: string,
                  studentMiddleName: string,
                  studentFirstLastName: string,
                  studentSecondLastName: string,
                  studentEnrolmentCode: string,
                  userId: string,
                  userRole: string,
                  userSchoolId: string): Promise<void>;
    deleteStudent(studentId: string, userId: string, userRole: string, userSchoolId: string): Promise<void>;
}