import type { Scales } from "./Scales.types.js";

export interface IScalesRepository {
    getScales: (userSchoolId: string) => Promise<Scales[]>;
}