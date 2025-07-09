import {
  createLink,
  getLinkByToken,
  getLinkByFileId,
} from "../models/linkModel";
import { Request, Response } from "express";
import { Link } from "../models/linkModel";
import { v4 as uuidv4 } from "uuid";

export async function generateLink(req: Request, res: Response) {
  const fileId: string = req.body.fileId;

  try {
    const existingLink = await getLinkByFileId(fileId);
    if (existingLink) {
      res.status(200).json({
        token: existingLink.token,
      });
      return;
    }

    const token = uuidv4();

    const link: Link = {
      token: token,
      fileId: fileId,
    };

    await createLink(link);
    res.status(201).json({
      token: token,
    });
  } catch (error) {
    console.error("Error checking existing link:", error);
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
      res.json({ fileId: link.fileId });
    }
  } catch (error) {
    console.error("Error fetching link:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// export async function getLink(req: Request, res: Response) {
//   const fileId = Number(req.params.fileId);

//   try {
//     const link = await getLinkByFileId(fileId);
//     if (!link) {
//       res.status(404).json({ error: "Link not found" });
//     } else {
//       res.json(link.token);
//     }
//   } catch (error) {
//     console.error("Error fetching link:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// }
