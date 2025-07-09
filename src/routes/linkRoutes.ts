import express from "express";
import { generateLink, getFileByLink } from "../controllers/linkController";
import { body, param } from "express-validator";
import validateRequest from "../middlewares/requestValidator.middleware";
import fileExistanceValidator from "../middlewares/fileExistanceValidator.middleware";
import isAuthenticated from "../middlewares/isAuthenticated.middleware";
import isAdmin from "../middlewares/isAdmin.middleware";

const router = express.Router();

//TODO add middleware to check if user is authenticated for generating link

router.post(
  "/generate-link",
  isAuthenticated,
  isAdmin,
  body("fileId").notEmpty().isString().withMessage("fileId is required"),
  validateRequest,
  fileExistanceValidator,
  generateLink
);

router.get(
  "/:token",
  param("token")
    .notEmpty()
    .withMessage("token is requierd")
    .isLength({ min: 36, max: 36 })
    .withMessage("token length is not valid")
    .matches(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)
    .withMessage("token format is not valid"),
  validateRequest,
  getFileByLink
);

export default router;
