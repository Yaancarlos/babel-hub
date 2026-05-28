import { Router } from "express";
import { authorizedRoles } from "../../../middleware/role.middleware.js";
import { authMiddleware } from "../../../middleware/auth.middleware.js";
import { strictLimiter } from "../../../middleware/ratelimit.middleware.js";

import { PostgresStudentRepository } from "./PostgresStudentRepository.js";
import { StudentService } from "../application/StudentService.js";
import { StudentControllers } from "./StudentControllers.js";

const repository = new PostgresStudentRepository();
const service = new StudentService(repository);
const controllers = new StudentControllers(service);

const router: Router = Router();

router.get(
    '/',
    authMiddleware,
    authorizedRoles(['principal', 'teacher', 'admin']),
    controllers.getStudents
);

router.get(
    '/:id',
    authMiddleware,
    authorizedRoles(['principal', 'teacher', 'admin']),
    controllers.getStudentDetails
);

router.post(
    "/",
    strictLimiter,
    authMiddleware,
    authorizedRoles(['principal', 'admin']),
    controllers.createStudent
);

router.put(
    "/:id",
    strictLimiter,
    authMiddleware,
    authorizedRoles(['principal', 'admin']),
    controllers.updateStudent
);

router.delete(
    "/:id",
    strictLimiter,
    authMiddleware,
    authorizedRoles(['principal', 'admin']),
    controllers.deleteStudent
);

export default router;