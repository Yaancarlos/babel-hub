import { Router } from 'express';
import { authorizedRoles } from "../../../middleware/role.middleware.js";
import { authMiddleware } from "../../../middleware/auth.middleware.js";
import { strictLimiter } from "../../../middleware/ratelimit.middleware.js";

import { PostgresAssignmentRepository } from "./PostgersAssigmentRepository.js";
import { AssignmentController } from "./AssignmentController.js";
import { AssignmentService } from "../application/AssignmentService.js";

const repository = new PostgresAssignmentRepository();
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

router.put(
    "/:assignmentId",
    strictLimiter,
    authMiddleware,
    authorizedRoles(['principal', 'teacher']),
    controller.updateAssignment
);

router.delete(
    "/:assignmentId",
    strictLimiter,
    authMiddleware,
    authorizedRoles(['principal', 'teacher']),
    controller.deleteAssignment
)

export default router;