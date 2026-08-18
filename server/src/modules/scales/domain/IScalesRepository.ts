import type { Scales } from "./Scales.types.js";

export interface IScalesRepository {
    getScales: (userSchoolId: string) => Promise<Scales[]>;
    getClassScale: (classId: string, userSchoolId: string) => Promise<Scales>;
}