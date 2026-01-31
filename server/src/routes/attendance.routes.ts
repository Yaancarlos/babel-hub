import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", authMiddleware, (req, res) => {
    res.json({ message: "Attendance data" });
});

export default router;
