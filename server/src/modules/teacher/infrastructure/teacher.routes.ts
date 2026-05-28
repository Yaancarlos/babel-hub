import { Router } from 'express';
import { authMiddleware } from "../../../middleware/auth.middleware.js";
import  { authorizedRoles } from "../../../middleware/role.middleware.js";
import { strictLimiter } from "../../../middleware/ratelimit.middleware.js";

import { PostgresTeacherRepository } from "./PostgresTeacherRepository.js";
import { TeacherServices } from "../application/TeacherServices.js";
import { TeacherControllers } from "./TeacherControllers.js";

const repository = new PostgresTeacherRepository();
const service = new TeacherServices(repository);
const controllers = new TeacherControllers(service);

const router: Router = Router();

router.get(
    "/",
    authMiddleware,
    authorizedRoles(["principal", "admin"]),
    controllers.getTeachers
);

router.get(
    "/:id",
    authMiddleware,
    authorizedRoles(["principal", "admin"]),
    controllers.getTeacherDetails
);

router.post(
    "/",
    strictLimiter,
    authMiddleware,
    authorizedRoles(["principal", "admin"]),
    controllers.createTeacher
);

router.put(
    "/:id",
    strictLimiter,
    authMiddleware,
    authorizedRoles(["principal", "admin"]),
    controllers.updateTeacher
);

router.delete(
    "/:id",
    strictLimiter,
    authMiddleware,
    authorizedRoles(["principal", "admin"]),
    controllers.deleteTeacher
);

export default router;