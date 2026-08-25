import { Router } from 'express';
import { authorizedRoles } from "../../../middleware/role.middleware.js";
import { authMiddleware } from "../../../middleware/auth.middleware.js";
import { strictLimiter } from "../../../middleware/ratelimit.middleware.js";

import { PostgresGradeRepository } from "./PostgresGradeRepository.js";
import { GradeService } from "../application/GradeService.js";
import { GradeController } from "./GradeController.js";
import { PostgresScaleRepository } from "../../scales/infrastructure/PostgresScaleRepository.js";

const gradeRepository = new PostgresGradeRepository();
const scaleRepository = new PostgresScaleRepository();
const service = new GradeService(gradeRepository, scaleRepository);
const controller = new GradeController(service);

const router: Router = Router();

router.post(
    "/class/:classId/assignment/:assignmentId",
    strictLimiter,
    authMiddleware,
    authorizedRoles(['principal', 'teacher']),
    controller.bulkUpsertGrades
)

export default router;