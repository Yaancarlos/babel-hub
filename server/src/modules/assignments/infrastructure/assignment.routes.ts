import { Router } from 'express';
import { authorizedRoles } from "../../../middleware/role.middleware.js";
import { authMiddleware } from "../../../middleware/auth.middleware.js";

import { PostgresAssigmentRepository } from "./PostgersAssigmentRepository.js";
import { AssignmentController } from "./AssignmentController.js";
import { AssignmentService } from "../application/AssigmentService.js";

const repository = new PostgresAssigmentRepository();
const service = new AssignmentService(repository);
const controller = new AssignmentController(service);

const router: Router = Router();

router.get(
    "/:courseId/class/:classId/overview",
    authMiddleware,
    authorizedRoles(['principal']),
    controller.getAssignmentOverview
)

export default router;