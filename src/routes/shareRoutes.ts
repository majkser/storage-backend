import express from "express";
import { Request, Response } from "express";

const router = express.Router();

router.get("/generate/:fileId", (req: Request, res: Response) => {
  res.send(req.params.fileId);
});

router.get("/:token", (req: Request, res: Response) => {
  res.send(req.params.token);
});

export default router;
