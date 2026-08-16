import { Router } from 'express';
import { authorizedRoles } from "../../../middleware/role.middleware.js";
import { authMiddleware } from "../../../middleware/auth.middleware.js";
import { strictLimiter } from "../../../middleware/ratelimit.middleware.js";

import { PostgresGradeRepository } from "./PostgresGradeRepository.js";
import { GradeService } from "../application/GradeService.js";
import { GradeController } from "./GradeController.js";

const repository = new PostgresGradeRepository();
const service = new GradeService(repository);
const controller = new GradeController(service);

const router: Router = Router();

router.post(
    "/assignment/:assignmentId",
    strictLimiter,
    authMiddleware,
    authorizedRoles(['principal', 'teacher']),
    controller.bulkUpsertGrades
)

export default router;