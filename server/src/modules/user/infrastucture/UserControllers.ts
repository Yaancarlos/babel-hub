import type { UserService } from "../application/UserService.js";
import type { AuthenticatedRequest } from "../../../middleware/auth.middleware.js";
import type { Response, NextFunction} from "express";

export class UserController {
    constructor( private readonly userService: UserService ) {}

    getUser = async (request: AuthenticatedRequest, response: Response, next: NextFunction) => {
        try {
            const authUserId = request.user!.authUserId as string;

            const user = await this.userService.getUser(authUserId);
            response.status(200).json({ responseData: user });
        } catch (error : any) {
            next(error);
        }
    }
}