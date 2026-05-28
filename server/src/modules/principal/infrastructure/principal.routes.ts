import { Router } from 'express';
import { authMiddleware } from "../../../middleware/auth.middleware.js";
import { authorizedRoles } from "../../../middleware/role.middleware.js";
import { strictLimiter } from "../../../middleware/ratelimit.middleware.js";

import { PostgresPrincipalRepository } from "./PostgresPrincipalRepository.js";
import { PrincipalService } from "../application/PrincipalService.js";
import { PrincipalController } from "./PrincipalControllers.js";

const repository = new PostgresPrincipalRepository();
const service = new PrincipalService(repository);
const controller = new PrincipalController(service);

const router: Router = Router();

router.post(
    "/",
    strictLimiter,
    authMiddleware,
    authorizedRoles(["principal", "admin"]),
    controller.createPrincipal
);

export default router;