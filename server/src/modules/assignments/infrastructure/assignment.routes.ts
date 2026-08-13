import { Router } from 'express';
import { authorizedRoles } from "../../../middleware/role.middleware.js";
import { authMiddleware } from "../../../middleware/auth.middleware.js";
import { strictLimiter } from "../../../middleware/ratelimit.middleware.js";

import { PostgresAssigmentRepository } from "./PostgersAssigmentRepository.js";
import { AssignmentController } from "./AssignmentController.js";
import { AssignmentService } from "../application/AssignmentService.js";

const repository = new PostgresAssigmentRepository();
const service = new AssignmentService(repository);
const controller = new AssignmentController(service);

const router: Router = Router();

router.get(
    "/:courseId/class/:classId/overview",
    authMiddleware,
    authorizedRoles(['principal', 'teacher']),
    controller.getAssignmentOverview
);

router.post(
    "/",
    strictLimiter,
    authMiddleware,
    authorizedRoles(['principal', 'teacher']),
    controller.createAssignment
)

export default router;