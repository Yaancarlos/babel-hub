import { Router } from 'express';
import { authorizedRoles } from "../../../middleware/role.middleware.js";
import { authMiddleware } from "../../../middleware/auth.middleware.js";

import { PostgresScaleRepository } from "./PostgresScaleRepository.js";
import { ScaleService } from "../application/ScaleService.js";
import { ScaleControllers } from "./ScaleControllers.js";

const postgres = new PostgresScaleRepository();
const service = new ScaleService(postgres);
const controller = new ScaleControllers(service);

const router: Router = Router();

router.get(
    "/",
    authMiddleware,
    authorizedRoles(['principal', 'teacher']),
    controller.getScales
);

router.get(
    "/class/:classId",
    authMiddleware,
    authorizedRoles(['principal', 'teacher']),
    controller.getClassScale
);

export default router;