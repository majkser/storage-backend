import { Request, Response, NextFunction } from "express";
import { findById } from "../models/file.model";

export default async function fileExistanceValidator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const fileId = req.body.fileId;

  if (!fileId) {
    res.status(400).json({ error: "File ID is required" });
    return;
  }

  try {
    const file = await findById(fileId);

    if (!file) {
      res.status(404).json({
        error: "File not found",
        message: "File with id: " + fileId + " does not exist",
      });
      return;
    }

    next();
  } catch (error) {
    console.error("Error checking file existence:", error);
    res.status(500).json({ error: "Error validating file existance" });
  }
}
