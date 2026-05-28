import type { CreatePeriod, Period, UpdatePeriod } from "./Period.types.js";

export interface IPeriodsRepository {
    getPeriods(userSchoolId: string): Promise<Period[]>;
    createPeriod(periodName: string, startDate: string, endDate: string, userId: string, userRole: string, userSchoolId: string): Promise<CreatePeriod>;
    updatePeriod(periodId: string, periodName: string, startDate: string, endDate: string, userId: string, userRole: string, userSchoolId: string): Promise<UpdatePeriod>;
    deletePeriod(periodId: string, userId: string, userRole: string, userSchoolId: string): Promise<void>;
}