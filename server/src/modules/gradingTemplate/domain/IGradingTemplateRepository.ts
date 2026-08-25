import type { AssessmentCriteria, GradingTemplate } from "./GradingTemplate.types.js";

export interface IGradingTemplateRepository {
    getGradingTemplates(userSchoolId: string): Promise<GradingTemplate[]>;
    getGradingTemplateDetails(gradingId: string, userSchoolId: string): Promise<AssessmentCriteria>;
    createGradingTemplate(gradingName: string, gradingScaleId: string, userId: string, userRole: string, userSchoolId: string): Promise<void>;
    deleteGradingTemplate(gradingId: string, userId: string, userRole: string, userSchoolId: string): Promise<void>;
    updateGradingTemplate(gradingId: string, gradingName: string, gradingScaleId: string, userId: string, userRole: string, userSchoolId: string): Promise<void>;
}