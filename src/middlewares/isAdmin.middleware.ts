import { NextFunction, Request, Response } from "express";
import { User } from "../models/userModel";

export default function isAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { email } = req.user as User;
  const adminEmails = (process.env.ADMIN_EMAILS || "").split(",");

  if (adminEmails.includes(email)) {
    return next();
  }
  res.status(403).json({ error: "Forbidden" });
}
