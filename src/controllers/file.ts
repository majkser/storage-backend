import { Request, Response } from 'express';
import { File } from '../models/file.model';
import fs from 'fs';
import { createFile, findById, findByUserId, deleteFile } from '../models/file.model';

export class FileController {
    static async uploadFile(req: Request, res: Response): Promise<void> {
        if (!req.file) {
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }
        
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const userId = (req.user as any).id;
            const parentFolderId = req.body.folderId ? parseInt(req.body.folderId) : null;

            const fileData: File = {
                id: 0, // This will be auto-incremented by the database
                fileName: req.file.filename,
                originalName: req.file.originalname,
                filePath: req.file.path,
                size: req.file.size,
                mimetype: req.file.mimetype,
                userId: userId,
                parentFolderId: parentFolderId,
                isPublic: req.body.isPublic == true,
                createdAt: new Date(),
            };

            const fileId = await createFile(fileData);

            res.status(201).json({
                message: 'File uploaded successfully',
                file: {
                    fileName: fileData.fileName,
                    id: fileId,
                }
            });
        } catch (err) {
            console.error("Error uploading file:", err);
            res.status(500).json({ error: 'Internal server error while uploading file' });
        }
    }

    static async getFiles(req: Request, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }
            const userId = (req.user as any).id;
            const parentFolderId = req.params.parentFolderId ? parseInt(req.params.parentFolderId) : null;

            const files = await findByUserId(userId, parentFolderId);

            res.status(200).json({
                message: 'Files retrieved successfully',
                files: files.map(file => ({
                    id: file.id,
                    fileName: file.fileName,
                    originalName: file.originalName,
                    size: file.size,
                    mimetype: file.mimetype,
                    createdAt: file.createdAt,
                }))
            });

        } catch (err) {
            console.error("Error fetching files:", err);
            res.status(500).json({ error: 'Internal server error while fetching files' });
        }
    }

    static async downloadFile(req: Request, res: Response): Promise<void> {
        try {
            
            const fileId = parseInt(req.params.fileId);
            const file = await findById(fileId);

            if (!file) {
                res.status(404).json({ error: 'File not found' });
                return;
            }

            if (!req.user || ((req.user as any).id !== file.userId && !file.isPublic)) {
                res.status(403).json({ error: 'Access denied' });
                return;
            }

            const filePath = file.filePath;
            
            if (!fs.existsSync(filePath)) {
                res.status(404).json({ error: 'File not found on server' });
                return;
            }
            
            res.download(filePath, file.originalName);

        } catch (err) {
            console.error("Error downloading file:", err);
            res.status(500).json({ error: 'Internal server error while downloading file' });
        }
    }

    // This method is used to delete a file from the server and database
    // I called it removeFile to avoid confusion with the deleteFile method in the model
    // which is used to delete a file from the database only
    // The removeFile method will first delete the file from the server and then delete the record from the database
    static async removeFile(req: Request, res: Response): Promise<void> {
        try {

            const fileId = parseInt(req.params.fileId);
            const file = await findById(fileId);

            if (!file) {
                res.status(404).json({ error: 'File not found' });
                return;
            }
            
            if (!req.user || ((req.user as any).id !== file.userId && !file.isPublic)) {
                res.status(403).json({ error: 'Access denied' });
                return;
            }

            const filePath = file.filePath;
            
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }

            await deleteFile(fileId);
            res.status(200).json({ message: 'File deleted successfully' });
        } catch (err) {
            console.error("Error deleting file:", err);
            res.status(500).json({ error: 'Internal server error while deleting file' });
        }
    }

}