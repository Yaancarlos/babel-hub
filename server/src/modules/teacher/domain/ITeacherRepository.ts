import type { CreateTeacher, TeacherDetails, Teachers } from "./Teacher.types.js";
import type {AuthUser, TeacherCreateCredentials, TeacherUpdateCredentials} from "../../shared/domain/Shared.types.js";

export interface ITeacherRepository {
    getTeachers(userSchoolId: string, available: string | undefined, includeTeacherId: string | undefined, isActive: boolean): Promise<Teachers[]>;
    getTeacherDetails(teacherId: string, userSchoolId: string): Promise<TeacherDetails | null>;
    createTeacher(teacherCredentials: TeacherCreateCredentials, auth: AuthUser): Promise<CreateTeacher>;
    updateTeacher(teacherCredentials: TeacherUpdateCredentials, auth: AuthUser): Promise<void>;
    deleteTeacher(teacherId: string, userId: string, userRole: string, userSchoolId: string): Promise<void>;
}