import type { CreateTeacher, TeacherDetails, Teachers } from "./Teacher.types.js";

export interface ITeacherRepository {
    getTeachers(userSchoolId: string, available: string | undefined, includeTeacherId: string | undefined, isActive: boolean): Promise<Teachers[]>;
    getTeacherDetails(teacherId: string, userSchoolId: string): Promise<TeacherDetails | null>;
    createTeacher(teacherFirstName: string,
                  teacherMiddleName: string | null | undefined,
                  teacherFirstLastName: string,
                  teacherSecondLastName: string | null | undefined,
                  teacherPassword: string,
                  teacherEmail: string,
                  userId: string,
                  userRole: string,
                  userSchoolId: string): Promise<CreateTeacher>;
    updateTeacher(teacherId: string,
                  teacherFirstName: string,
                  teacherMiddleName: string | null | undefined,
                  teacherFirstLastName: string,
                  teacherSecondLastName: string | null | undefined,
                  userId: string,
                  userRole: string,
                  userSchoolId: string): Promise<void>;
    deleteTeacher(teacherId: string, userId: string, userRole: string, userSchoolId: string): Promise<void>;
}