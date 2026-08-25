import type { AvailableSubjects, CreateSubject, SubjectDetails } from "./Subjects.types.js";

export interface ISubjectsRepository {
    getSubjectsByArea(subjectAreaId: string, userSchoolId: string): Promise<SubjectDetails[]>;
    getAvailableSubjects(courseId: string, userSchoolId: string): Promise<AvailableSubjects[]>;
    createSubject(subjectName: string, subjectAreaId: string, gradingTemplateId: string, userId: string, userRole: string, userSchoolId: string): Promise<CreateSubject>;
    updateSubject(subjectId: string, subjectName: string, subjectAreaId: string, gradingTemplateId: string, userId: string, userRole: string, userSchoolId: string): Promise<void>;
    deleteSubject(subjectId: string, userId: string, userRole: string, userSchoolId: string): Promise<void>;
}