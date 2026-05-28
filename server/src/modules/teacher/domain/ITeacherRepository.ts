import type { CreateTeacher, TeacherDetails, Teachers } from "./Teacher.types.js";

export interface ITeacherRepository {
    getTeachers(userSchoolId: string, available: string | undefined, includeTeacherId: string | undefined): Promise<Teachers[]>;
    getTeacherDetails(teacherId: string, userSchoolId: string): Promise<TeacherDetails | null>;
    createTeacher(teacherName: string, teacherPassword: string, teacherEmail: string, userId: string, userRole: string, userSchoolId: string): Promise<CreateTeacher>;
    updateTeacher(teacherId: string, teacherName: string, userId: string, userRole: string, userSchoolId: string): Promise<void>;
    deleteTeacher(teacherId: string, userId: string, userRole: string, userSchoolId: string): Promise<void>;
}