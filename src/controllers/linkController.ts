import { createLink, getLinkByToken } from "../models/linkModel";
import { Request, Response } from "express";
import { Link } from "../models/linkModel";

export async function generateLink(req: Request, res: Response) {
  const fileId = await req.body.fileId;
  const token = req.body.token;
  //const fileId = 1;

  const link: Link = {
    token: token,
    fileId: fileId,
  };

  try {
    await createLink(link);
    res.status(200).json({ link: link.token });
  } catch (error) {
    console.error("Error generating link:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getFileByLink(req: Request, res: Response) {
  const token = req.params.token;

  try {
    const link = await getLinkByToken(token);
    if (!link) {
      res.status(404).json({ error: "Link not found" });
    } else {
      res.json(link);
    }
  } catch (error) {
    console.error("Error fetching link:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
