import { Router } from "express";
import { authMiddleware } from "../../../middleware/auth.middleware.js";
import { authorizedRoles } from "../../../middleware/role.middleware.js";
import { strictLimiter } from "../../../middleware/ratelimit.middleware.js";

import { PostgresPeriodRepository } from "./PostgresPeriodRepository.js";
import { PeriodService } from "../application/PeriodServices.js";
import { PeriodControllers } from "./PeriodControllers.js";

const repository = new PostgresPeriodRepository()
const service = new PeriodService(repository);
const controller = new PeriodControllers(service);

const router: Router = Router();

router.get(
    "/",
    authMiddleware,
    authorizedRoles(["principal", "admin", "teacher", "parent", "student"]),
    controller.getPeriods
);

router.post(
    "/",
    strictLimiter,
    authMiddleware,
    authorizedRoles(["principal", "admin"]),
    controller.createPeriod
);

router.put(
    "/:id",
    strictLimiter,
    authMiddleware,
    authorizedRoles(["principal", "admin"]),
    controller.updatePeriod
);

router.delete(
    "/:id",
    strictLimiter,
    authMiddleware,
    authorizedRoles(["principal", "admin"]),
    controller.deletePeriod
);

export default router;