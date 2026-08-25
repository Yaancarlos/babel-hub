import type { IGradingTemplateRepository } from "../domain/IGradingTemplateRepository.js";
import type { AssessmentCriteria, GradingTemplate } from "../domain/GradingTemplate.types.js";
import { UnauthorizedError, ValidationError } from "../../errors/domain/CustomErrors.js";

export class GradingTemplateService {
    constructor(private readonly gradingRepository: IGradingTemplateRepository) {}

    async getGradingTemplates (userSchoolId: string): Promise<GradingTemplate[]> {
        if (!userSchoolId) throw new UnauthorizedError('Credenciales del usuario (master) invalidas del usuario (master)');

        return this.gradingRepository.getGradingTemplates(userSchoolId);
    }
    async getGradingTemplateDetails (gradingId: string, userSchoolId: string): Promise<AssessmentCriteria>  {
        if (!userSchoolId) throw new UnauthorizedError('Credenciales del usuario (master) invalidas del usuario (master)');
        if (!gradingId) throw new ValidationError('El id del criterio de nota no fue entregado');

        return this.gradingRepository.getGradingTemplateDetails(gradingId, userSchoolId);
    }
    async createGradingTemplate (gradingName: string, gradingScaleId: string, userId: string, userRole: string, userSchoolId: string): Promise<void> {
        if (!userSchoolId || !userRole ||!userId) throw new UnauthorizedError('Credenciales del usuario (master) invalidas del usuario (master)');
        if (!gradingName || !gradingScaleId) throw new ValidationError('Hay campos obligatorias vacios');

        return this.gradingRepository.createGradingTemplate(gradingName, gradingScaleId, userId, userRole, userSchoolId);
    }
    async deleteGradingTemplate (gradingId: string, userId: string, userRole: string, userSchoolId: string): Promise<void> {
        if (!userSchoolId || !userRole ||!userId) throw new UnauthorizedError('Credenciales del usuario (master) invalidas del usuario (master)');
        if (!gradingId) throw new ValidationError('El id del criterio de nota no fue entregado');

        return this.gradingRepository.deleteGradingTemplate(gradingId, userId, userRole, userSchoolId);
    }
    async updateGradingTemplate (gradingId: string, gradingName: string, gradingScaleId: string, userId: string, userRole: string, userSchoolId: string): Promise<void> {
        if (!userSchoolId || !userRole ||!userId) throw new UnauthorizedError('Credenciales del usuario (master) invalidas del usuario (master)');
        if (!gradingId || !gradingName || !gradingScaleId) throw new ValidationError('Hay campos obligatorias vacios');

        return this.gradingRepository.updateGradingTemplate(gradingId, gradingName, gradingScaleId, userId, userRole, userSchoolId);
    }
}