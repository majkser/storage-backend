import express from 'express';
import { Request, Response, NextFunction } from 'express';
import { uploadFile, getFiles, downloadFile, removeFile, getFileData } from '../controllers/file';
import { upload } from '../config/multerconf';
import { canAccessFile } from '../middlewares/fileAuth'; 

const router = express.Router();

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ error: 'Unauthorized' });
};

router.post('/upload', isAuthenticated, upload.array('file'), uploadFile);
router.get('/', isAuthenticated, getFiles);
router.get('/:id/download', downloadFile);
router.delete('/:id/delete', isAuthenticated, removeFile);
router.get('/:id', isAuthenticated, canAccessFile, getFileData);

export default router;