import { Router } from 'express';
import { upsertGrade, getGrades } from "../controllers/grades.controller.js";
import { authorizedRoles } from "../middleware/role.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/",
    authMiddleware,
    authorizedRoles(["student", "teacher", "principal"]),
    getGrades
);

router.post(
    "/",
    authMiddleware,
    authorizedRoles(["teacher", "principal"]),
    upsertGrade
);

export default router;