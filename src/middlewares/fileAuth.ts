import { NextFunction, Request, Response } from "express";
import { findById } from "../models/file.model";

// Middleware to check if user can access a specific file
export const canAccessFile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const fileId = parseInt(req.params.id);
    const file = await findById(fileId);

    if (!file) {
      res.status(404).json({ error: "File not found" });
      return;
    }

    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const currentUserId = (req.user as any).id;
    const userEmail = (req.user as any).email;
    const adminEmails = (process.env.ADMIN_EMAILS || "").split(",");
    const isAdmin = adminEmails.includes(userEmail);

    // Check if user owns the file OR is an admin
    if (file.userId !== currentUserId && !isAdmin) {
      res.status(403).json({ error: "Access denied: You can only access your own files" });
      return;
    }

    // Attach file to request for use in the controller
    (req as any).fileData = file;
    next();
  } catch (err) {
    console.error("Error checking file access:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};