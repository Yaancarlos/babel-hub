import type { IUserRepository } from "../domain/IUserRepository.js";
import type { UserProfileResponse } from "../domain/User.types.js";
import {NotFoundError, UnauthorizedError} from "../../errors/domain/CustomErrors.js";

export class UserService {
    constructor(private readonly userRepository: IUserRepository) {}

    async getUser(userId: string): Promise<UserProfileResponse> {
        if (!userId) throw new UnauthorizedError("Al cargar el usuario, no cargaron los datos");

        const user = await this.userRepository.getUser(userId);
        if (!user) throw new NotFoundError("Usuario no existe");

        return user;
    }
}