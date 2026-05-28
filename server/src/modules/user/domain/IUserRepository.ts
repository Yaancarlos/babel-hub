import type { UserProfileResponse } from "./User.types.js";

export interface IUserRepository {
    getUser(userId: string): Promise<UserProfileResponse | null>;
}