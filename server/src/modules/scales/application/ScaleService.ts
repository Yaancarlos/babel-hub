import type { IScalesRepository } from "../domain/IScalesRepository.js";
import type { Scales } from "../domain/Scales.types.js";
import { ValidationError } from "../../errors/domain/CustomErrors.js";

export class ScaleService {
    constructor(private readonly scaleRepository: IScalesRepository) {}

    async getScales(userSchoolId: string): Promise<Scales[]> {
        if (!userSchoolId) throw new ValidationError('Credenciales del usuario (master) invalidas');

        return await this.scaleRepository.getScales(userSchoolId);
    }

    async getClassScale(classId: string, userSchoolId: string): Promise<Scales> {
        if (!userSchoolId) throw new ValidationError('Credenciales del usuario (master) invalidas');
        if (!classId) throw new ValidationError('El id de la asignatura no esta siendo enviado');

        return await this.scaleRepository.getClassScale(classId, userSchoolId);
    }
}