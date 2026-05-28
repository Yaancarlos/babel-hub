import { Router } from 'express';
import { authMiddleware } from "../../../middleware/auth.middleware.js";
import { authorizedRoles } from "../../../middleware/role.middleware.js";
import { strictLimiter } from "../../../middleware/ratelimit.middleware.js";

import { PostgresSchoolRepository } from "./PostgresSchoolRepository.js";
import { SchoolService } from "../application/SchoolService.js";
import { SchoolControllers } from "./SchoolControllers.js";

const repository = new PostgresSchoolRepository();
const service = new SchoolService(repository);
const controllers = new SchoolControllers(service);

const router: Router = Router();

router.post(
    "/",
    strictLimiter,
    authMiddleware,
    authorizedRoles(["admin"]),
    controllers.createSchool
);

export default router;