import { createFileAccess } from "../models/fileAccessModel";
import { Request, Response } from "express";

export async function createFileAccessController(
  req: Request,
  res: Response
): Promise<void> {
  const { fileId, userId } = req.body;

  if (!fileId || !userId) {
    res.status(400).json({ error: "fileId and userId are required" });
    return;
  }

  try {
    await createFileAccess({ fileId, userId });
    res.status(201).json({ message: "File access created successfully" });
  } catch (error) {
    console.error("Error creating file access:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
