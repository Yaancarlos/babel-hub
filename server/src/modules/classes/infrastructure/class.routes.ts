import { Router } from 'express';
import { authorizedRoles } from "../../../middleware/role.middleware.js";
import { authMiddleware } from "../../../middleware/auth.middleware.js";
import { strictLimiter } from "../../../middleware/ratelimit.middleware.js";

import { PostgresClassRepository } from "./PostgresClassRepository.js";
import { ClassService } from "../application/ClassService.js";
import { ClassControllers } from "./ClassControllers.js";

const repository = new PostgresClassRepository();
const service = new ClassService(repository);
const controller = new ClassControllers(service);

const router: Router = Router();

router.get(
    "/teacher/classes",
    authMiddleware,
    authorizedRoles(["teacher"]),
    controller.getTeacherClasses
);

router.get(
    "/:id",
    authMiddleware,
    authorizedRoles(["principal", "admin"]),
    controller.getClassDetails
);

router.get(
    "/teacher/class/:classId",
    authMiddleware,
    authorizedRoles(["teacher"]),
    controller.getTeacherClassDetails
);

router.post(
    "/",
    strictLimiter,
    authMiddleware,
    authorizedRoles(["principal", "admin"]),
    controller.createClass
);

router.put(
    "/:classId",
    strictLimiter,
    authMiddleware,
    authorizedRoles(["principal", "admin"]),
    controller.updateClass
)

router.delete(
    "/:classId",
    strictLimiter,
    authMiddleware,
    authorizedRoles(["principal", "admin"]),
    controller.deleteClass
);

export default router;
