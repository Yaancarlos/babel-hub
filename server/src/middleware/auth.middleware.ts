import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken"

interface AuthPayload extends JwtPayload {
    sub: string; // supabase_user_id
    email?: string;
    role?: string;
}

export interface AuthenticatedRequest extends Request {
    user?: {
        supabaseUserId: string;
    };
}

// @ts-ignore
export function authMiddleware(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Missing authorization token" });
    }

    const token = authHeader.split(" ")[1] || "";

    try {
        const decoded = jwt.verify(
            token,
            process.env.SUPABASE_JWT_SECRET as string
        ) as AuthPayload;

        req.user = {
            supabaseUserId: decoded.sub,
        };

        next();
    } catch (error) {
        console.error("Auth Error:", error instanceof Error ? error.message : error);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}