import { Request, Response } from "express";
import { File } from "../models/file.model";
import fs from "fs";
import {
  createFile,
  findById,
  findAllFiles,
  findByUserAccess,
  deleteFile,
} from "../models/file.model";
import { User } from "../models/userModel";

export const uploadFile = async (
  req: Request,
  res: Response
): Promise<void> => {
  const hasFiles =
    (req.files && (Array.isArray(req.files) ? req.files.length > 0 : true)) ||
    req.file;

  if (!hasFiles) {
    res.status(400).json({ error: "No files uploaded" });
    return;
  }

  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const user = req.user as User;
    if (!user.id) {
      res.status(400).json({ error: "User ID is missing" });
      return;
    }

    const userId = user.id;
    const parentFolderId = req.body.folderId || null;
    const uploadedFiles = [];
    let filesToProcess: Express.Multer.File[] = [];

    if (req.files) {
      if (Array.isArray(req.files)) {
        filesToProcess = req.files;
      } else {
        Object.keys(req.files).forEach((key) => {
          const fileArray = (
            req.files as Record<string, Express.Multer.File[]>
          )[key];
          filesToProcess = filesToProcess.concat(fileArray);
        });
      }
    } else if (req.file) {
      filesToProcess = [req.file];
    }

    for (const file of filesToProcess) {
      const fileData = {
        filename: file.filename,
        originalName: file.originalname,
        filePath: file.path,
        size: file.size,
        mimetype: file.mimetype,
        userId: userId,
        parentFolderId: parentFolderId,
        isPublic: req.body.isPublic === "true",
        updatedAt: undefined,
      };

      const fileId = await createFile(fileData);
      uploadedFiles.push({
        id: fileId,
        filename: fileData.filename,
        originalName: fileData.originalName,
      });
    }

    res.status(201).json({
      message: "Files uploaded successfully",
      files: uploadedFiles,
    });
  } catch (err) {
    console.error("Error uploading files:", err);
    res
      .status(500)
      .json({ error: "Internal server error while uploading files" });
  }
};

export const getFiles = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const user = req.user as User;
    if (!user.id) {
      res.status(400).json({ error: "User ID is missing" });
      return;
    }

    const userId = user.id;

    let files: File[];

    if (req.isAdmin === true) {
      files = await findAllFiles();
    } else {
      files = await findByUserAccess(userId);
    }

    res.status(200).json({
      message: "Files retrieved successfully",
      files: files.map((file) => ({
        id: file.id,
        filename: file.filename,
        originalName: file.originalName,
        size: file.size,
        mimetype: file.mimetype,
        createdAt: file.createdAt,
        isPublic: file.isPublic,
      })),
    });
  } catch (err) {
    console.error("Error fetching files:", err);
    res
      .status(500)
      .json({ error: "Internal server error while fetching files" });
  }
};

export const getFileData = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const file = (req as any).fileData;

    res.status(200).json({
      message: "File data retrieved successfully",
      id: file.id,
      filename: file.filename,
      originalName: file.originalName,
      filePath: file.filePath,
      size: file.size,
      mimetype: file.mimetype,
      userId: file.userId,
      parentFolderId: file.parentFolderId,
      isPublic: file.isPublic,
      createdAt: file.createdAt,
      updatedAt: file.updatedAt,
    });
  } catch (err) {
    console.error("Error fetching file data:", err);
    res
      .status(500)
      .json({ error: "Internal server error while fetching file data" });
  }
};

export const downloadFile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const fileId = req.params.id;
    const file = await findById(fileId);

    if (!file) {
      res.status(404).json({ error: "File not found" });
      return;
    }

    const filePath = file.filePath;

    if (!fs.existsSync(filePath)) {
      res.status(404).json({ error: "File not found on server" });
      return;
    }

    res.download(filePath, file.originalName);
  } catch (err) {
    console.error("Error downloading file:", err);
    res
      .status(500)
      .json({ error: "Internal server error while downloading file" });
  }
};

export const removeFile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const fileId = req.params.fileId;
    const file = await findById(fileId);

    if (!file) {
      res.status(404).json({ error: "File not found" });
      return;
    }

    if (
      !req.user ||
      ((req.user as User).id !== file.userId &&
        !file.isPublic &&
        req.isAdmin !== true)
    ) {
      res.status(403).json({ error: "Access denied" });
      return;
    }

    const filePath = file.filePath;

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    const deleted = await deleteFile(fileId);

    if (!deleted) {
      res.status(500).json({ error: "Failed to delete file from database" });
      return;
    }

    res.status(200).json({ message: "File deleted successfully" });
  } catch (err) {
    console.error("Error deleting file:", err);
    res
      .status(500)
      .json({ error: "Internal server error while deleting file" });
  }
};
