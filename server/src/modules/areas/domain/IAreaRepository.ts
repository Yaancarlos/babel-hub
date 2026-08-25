import type { Area, AreaDetails } from "./Areas.types.js";

export interface IAreaRepository {
    getAreas(schoolId: string): Promise<Area[]>;
    getAreaDetails(id: string, schoolId: string): Promise<AreaDetails | null>;
    insertArea(name: string, userId: string, userRole: string, userSchoolId: string): Promise<Area>;
    updateArea(id: string, newName: string, userId: string, userRole: string, userSchoolId: string): Promise<Area>;
    deleteArea(id: string, userId: string, userRole: string, userSchoolId: string): Promise<void>;
}