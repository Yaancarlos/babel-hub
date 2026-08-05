import type { Assessment } from './Assessment.types.js';

export interface IAssessmentRepository {
    getAssessments(userSchoolId: string): Promise<Assessment[]>;
    getTotalWeightForTemplate(gradingTemplateId: string, excludeAssessmentId?: string): Promise<number>;
    createAssessment(assessmentName: string, assessmentWeight: number, gradingTemplateId: string, userId: string, userRole: string, userSchoolId: string): Promise<void>;
    updateAssessment(assessmentId: string, assessmentName: string, assessmentWeight: number, gradingTemplateId: string, userId: string, userRole: string, userSchoolId: string): Promise<void>;
    deleteAssessment(assessmentId: string, userId: string, userRole: string, userSchoolId: string): Promise<void>;
}