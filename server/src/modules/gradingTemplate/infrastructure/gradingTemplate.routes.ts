import { Router } from 'express';
import { authorizedRoles } from "../../../middleware/role.middleware.js";
import { authMiddleware } from "../../../middleware/auth.middleware.js";
import { strictLimiter } from "../../../middleware/ratelimit.middleware.js";

import { PostgresGradingTemplateRepository } from "./PostgresGradingTemplateRepository.js";
import { GradingTemplateController } from "./GradingTemplateControllers.js";
import { GradingTemplateService } from "../application/GradingTemplateService.js";

const postgresGradingTemplate = new PostgresGradingTemplateRepository();
const gradingTemplateService = new GradingTemplateService(postgresGradingTemplate);
const gradingTemplateController = new GradingTemplateController(gradingTemplateService);

const router: Router = Router();

router.get(
    "/",
    authMiddleware,
    authorizedRoles(['principal']),
    gradingTemplateController.getGradingTemplates
);

router.get(
    "/:gradingId",
    authMiddleware,
    authorizedRoles(['principal']),
    gradingTemplateController.getGradingTemplateDetails
);

router.post(
    "/",
    strictLimiter,
    authMiddleware,
    authorizedRoles(['principal']),
    gradingTemplateController.createGradingTemplate
);

router.put(
    "/:gradingId",
    strictLimiter,
    authMiddleware,
    authorizedRoles(['principal']),
    gradingTemplateController.updateGradingTemplate
);

router.delete(
    "/:gradingId",
    strictLimiter,
    authMiddleware,
    authorizedRoles(['principal']),
    gradingTemplateController.deleteGradingTemplate
);

export default router;