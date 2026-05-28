import type { IPeriodsRepository } from "../domain/IPeriodRepository.js";
import type { CreatePeriod, Period, UpdatePeriod } from "../domain/Period.types.js";
import { UnauthorizedError, ValidationError } from "../../errors/domain/CustomErrors.js";

export class PeriodService {
    constructor( private periodsRepository: IPeriodsRepository ) {}

    async getPeriods(userSchoolId: string): Promise<Period[]> {
        if (!userSchoolId) throw new UnauthorizedError("Faltan credenciales del usuario (master)");

        return await this.periodsRepository.getPeriods(userSchoolId);
    }

    async createPeriod(periodName: string, startDate: string, endDate: string, userId: string, userRole: string, userSchoolId: string): Promise<CreatePeriod> {
        if (!periodName || !startDate || !endDate) throw new ValidationError("Todos los campos deben estar llenos");
        if (endDate <= startDate) {
            throw new ValidationError("La fecha de inicio debe ser menor a la de fin");
        }
        if (!userId || !userRole || !userSchoolId) throw new UnauthorizedError("Faltan credenciales del usuario (master)");

        return await this.periodsRepository.createPeriod(periodName, startDate, endDate, userId, userRole, userSchoolId);
    }


    async updatePeriod(periodId: string, periodName: string, startDate: string, endDate: string, userId: string, userRole: string, userSchoolId: string): Promise<UpdatePeriod> {
        if (!periodId) throw new ValidationError("El ID del periodo es obligatorio");
        if (!periodName || !startDate || !endDate) throw new ValidationError("Todos los campos deben estar llenos");
        if (endDate <= startDate) throw new ValidationError("La fecha de inicio debe ser menor a la de fin");
        if (!userId || !userRole || !userSchoolId) throw new UnauthorizedError("Faltan credenciales del usuario (master)");

        return await this.periodsRepository.updatePeriod(periodId, periodName, startDate, endDate, userId, userRole, userSchoolId);
    }

    async deletePeriod(periodId: string, userId: string, userRole: string, userSchoolId: string): Promise<void> {
        if (!periodId) throw new ValidationError("El ID del periodo es obligatorio");
        if (!userId || !userRole || !userSchoolId) throw new UnauthorizedError("Faltan credenciales del usuario (master)");

        await this.periodsRepository.deletePeriod(periodId, userId, userRole, userSchoolId);
    }
}