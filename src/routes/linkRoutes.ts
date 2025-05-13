import express from "express";
import { generateLink, getFileByLink } from "../controllers/linkController";
import { body } from "express-validator";
import validateRequest from "../middleware/requestValidator.middleware";

const router = express.Router();

//TODO add middleware to check if user is authenticated for generating link

router.post(
  "/generate-link",
  body("fileId").toInt().notEmpty().isInt({ min: 1 }),
  validateRequest,
  generateLink
);
router.get("/:token", getFileByLink);

export default router;
