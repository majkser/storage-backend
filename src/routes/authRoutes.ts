import express from "express";
import passport from "passport";
import { Request, Response } from "express";

const router = express.Router();

router.post("/logout", (req: Request, res: Response) => {
  req.logout((error) => {
    if (error) {
      return res.status(500).json({ message: "Logout failed" });
    }
  });

  res.clearCookie("connect.sid");

  res.json({ message: "Logout successful" });
});

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
    successRedirect: `${process.env.FRONTEND_URL}/dashboard`,
  })
);

export default router;
