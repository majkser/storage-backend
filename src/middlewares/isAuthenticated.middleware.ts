import { NextFunction, Request, Response } from "express";
import { User } from "../models/userModel";

declare global {
  namespace Express {
    interface Request {
      isAdmin?: boolean;
    }
  }
}

export default function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (req.isAuthenticated()) {
    if (!req.user) {
      res.status(500).json({ error: "Authentication error" });
      return;
    }
    
    const { email } = req.user as User;
    const adminEmails = (process.env.ADMIN_EMAILS || "").split(",");
    const isAdmin = adminEmails.includes(email);
    
    req.isAdmin = isAdmin;
    
    next();
    return;
  }
  res.status(401).json({ error: "Unauthorized" });
}