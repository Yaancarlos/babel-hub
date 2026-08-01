import type { IScalesRepository } from "../domain/IScalesRepository.js";
import type { Scales } from "../domain/Scales.types.js";
import { ValidationError } from "../../errors/domain/CustomErrors.js";

export class ScaleService {
    constructor(private readonly scaleRepository: IScalesRepository) {}

    async getScales(userSchoolId: string): Promise<Scales[]> {
        if (!userSchoolId) throw new ValidationError('Credenciales del usuario (master) invalidas');

        return this.scaleRepository.getScales(userSchoolId);
    }
}