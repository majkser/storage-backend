import express from 'express';
import { Request, Response, NextFunction } from 'express';
import { uploadFile, getFiles, downloadFile, removeFile, getFileData } from '../controllers/file';
import { upload } from '../config/multerconf';
import isAuthenticated from '../middlewares/isAuthenticated.middleware';
import requestValidator from '../middlewares/requestValidator.middleware';
import { fetchFileData } from '../middlewares/fileFetch.middleware';
const router = express.Router();

router.post('/upload', isAuthenticated, upload.array('file'), uploadFile, requestValidator);
router.get('/userfiles', isAuthenticated, getFiles, requestValidator);
router.get('/:id/download', downloadFile, requestValidator);
router.delete('/:id/delete', isAuthenticated, removeFile, requestValidator);
router.get('/:id', fetchFileData ,getFileData, requestValidator);

export default router;