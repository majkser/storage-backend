import express from "express";
import {
  uploadFile,
  getFiles,
  downloadFile,
  removeFile,
  getFileData,
} from "../controllers/file";
import { upload } from "../config/multerconf";
import isAuthenticated from "../middlewares/isAuthenticated.middleware";
import requestValidator from "../middlewares/requestValidator.middleware";
import { fetchFileData } from "../middlewares/fileFetch.middleware";
const router = express.Router();

router.post(
  "/upload",
  isAuthenticated,
  upload.array("file"),
  requestValidator,
  uploadFile
);
router.get("/userfiles", isAuthenticated, requestValidator, getFiles);
router.get("/:id/download", requestValidator, downloadFile);
router.delete("/:id/delete", isAuthenticated, removeFile, requestValidator);
router.get("/:id", requestValidator, fetchFileData, getFileData);

export default router;
