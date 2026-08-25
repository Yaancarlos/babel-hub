import { Router } from 'express';
import { authorizedRoles } from "../../../middleware/role.middleware.js";
import { authMiddleware } from "../../../middleware/auth.middleware.js";
import { strictLimiter } from "../../../middleware/ratelimit.middleware.js";

import { PostgresAssessmentRepository } from "./PostgresAssessmentRepository.js";
import { AssessmentService } from "../application/AssessmentService.js";
import { AssessmentController } from "./AssessmentControllers.js";

const postgresAssessment = new PostgresAssessmentRepository();
const assessmentService = new AssessmentService(postgresAssessment);
const assessmentController = new AssessmentController(assessmentService);

const router: Router = Router();

router.get(
    "/",
    authMiddleware,
    authorizedRoles(['principal']),
    assessmentController.getAssessments
);

router.post(
    "/",
    strictLimiter,
    authMiddleware,
    authorizedRoles(['principal']),
    assessmentController.createAssessment
);

router.put(
    "/:assessmentId",
    strictLimiter,
    authMiddleware,
    authorizedRoles(['principal']),
    assessmentController.updateAssessment
);

router.delete(
    "/:assessmentId",
    strictLimiter,
    authMiddleware,
    authorizedRoles(['principal']),
    assessmentController.deleteAssessment
);

export default router;