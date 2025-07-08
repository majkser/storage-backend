import { NextFunction, Request, Response } from "express";
import { findById } from "../models/file.model";

// Middleware to fetch file data and attach it to the request
export const fetchFileData = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const fileId = req.params.id;
    
    // Validate that fileId exists and is a valid UUID format
    if (!fileId || !isValidUUID(fileId)) {
      res.status(400).json({ error: "Invalid file ID format" });
      return;
    }

    const file = await findById(fileId);
    
    if (!file) {
      res.status(404).json({ error: "File not found" });
      return;
    }

    // Attach file to request for use in the controller
    (req as any).fileData = file;
    next();
  } catch (err) {
    console.error("Error fetching file data:", err);
    res.status(500).json({ error: "Internal server error while fetching file" });
  }
};

// Helper function to validate UUID format
const isValidUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};