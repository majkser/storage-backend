import express from 'express';
import { Request, Response, NextFunction } from 'express';
import { FileController } from '../controllers/file';
import { upload } from '../config/multerconf';

const router = express.Router();

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ error: 'Unauthorized' });
};

router.post('/upload', isAuthenticated, upload.array('file'), FileController.uploadFile);
router.get('/', isAuthenticated, FileController.getFiles);
router.get('/:id/download', FileController.downloadFile);
router.delete('/:id', isAuthenticated, FileController.removeFile);

export default router;