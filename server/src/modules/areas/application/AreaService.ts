import type { IAreaRepository } from "../domain/IAreaRepository.js";
import { NotFoundError, UnauthorizedError, ValidationError } from "../../errors/domain/CustomErrors.js";

export class AreaService {
    constructor(private readonly areasRepository: IAreaRepository) {}

    async getAreas(schoolId: string) {
        if (!schoolId) throw new UnauthorizedError('Credenciales del usuario (master) invalidas del usuario (master)');

        return this.areasRepository.getAreas(schoolId);
    }

    async getAreaDetails(id: string, schoolId: string) {
        if (!schoolId) throw new UnauthorizedError('Credenciales del usuario (master) invalidas');
        if (!id) throw new ValidationError('El ID del área es obligatorio');

        const area = await this.areasRepository.getAreaDetails(id, schoolId);

        if (!area) throw new NotFoundError(`No se encontro la area ${id}`);

        return area;
    }

    async createArea(name: string, userId: string, userRole: string, userSchoolId: string) {
        if (!userSchoolId) throw new UnauthorizedError('Credenciales del usuario (master) invalidas')

        if (!name || name.trim() === '') {
            throw new ValidationError('El nombre del área no puede estar vacío');
        }

        return this.areasRepository.insertArea(name.trim(), userId, userRole, userSchoolId);
    }

    async updateArea(id: string, newName: string, userId: string, userRole: string, userSchoolId: string) {
        if (!userSchoolId) throw new UnauthorizedError('Credenciales del usuario (master) invalidas');
        if (!id) throw new ValidationError('El ID del área es obligatorio');

        if (!newName || newName.trim() === '') {
            throw new ValidationError('El nuevo nombre no puede estar vacío');
        }

        return this.areasRepository.updateArea(id, newName.trim(), userId, userRole, userSchoolId);
    }

    async deleteArea(id: string, userId: string, userRole: string, userSchoolId: string) {
        if (!userSchoolId) throw new UnauthorizedError('Credenciales del usuario (master) invalidas');
        if (!id) throw new ValidationError('El ID del área es obligatorio');

        return this.areasRepository.deleteArea(id, userId, userRole, userSchoolId);
    }
}