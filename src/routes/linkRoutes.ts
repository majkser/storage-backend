import express from "express";
import { generateLink, getFileByLink } from "../controllers/linkController";

const router = express.Router();

router.post("/generate-link", generateLink);
router.get("/:token", getFileByLink);

export default router;
