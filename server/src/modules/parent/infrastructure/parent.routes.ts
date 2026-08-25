import { Router } from 'express';
import { authMiddleware } from "../../../middleware/auth.middleware.js";
import { authorizedRoles } from "../../../middleware/role.middleware.js";
import { strictLimiter } from "../../../middleware/ratelimit.middleware.js";

import { PostgresParentRepository } from "./PostgresParentRepository.js";
import { ParentService } from "../application/ParentService.js";
import { ParentControllers } from "./ParentControllers.js";

const repository = new PostgresParentRepository();
const service = new ParentService(repository);
const controllers = new ParentControllers(service);

const router: Router = Router();

router.get(
    "/",
    authMiddleware,
    authorizedRoles(['principal', 'admin']),
    controllers.getParents
)

router.post(
    "/",
    strictLimiter,
    authMiddleware,
    authorizedRoles(['principal', 'admin']),
    controllers.createParent
);

router.post(
    "/link",
    strictLimiter,
    authMiddleware,
    authorizedRoles(['principal', 'admin']),
    controllers.linkParentToStudent
)

router.delete(
    "/:parentId",
    strictLimiter,
    authMiddleware,
    authorizedRoles(['principal', 'admin']),
    controllers.deleteParent
)

export default router;