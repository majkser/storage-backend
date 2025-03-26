import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import "./controllers/auth";
import passport from "passport";
import session from "express-session";
import { storage, uploadsDir, upload } from "./config/multerconf";
import { User } from "./models/userModel";
import { error } from "console";

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.get("/api/user", (req: Request, res: Response) => {
  if (req.isAuthenticated()) {
    const { id, username, email, photo } = req.user as User;
    res.json({ id, username, email, photo });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});

app.post("/api/logout", (req: Request, res: Response) => {
  req.logout((error) => {
    if (error) {
      return res.status(500).json({ message: "Logout failed" });
    }
  });

  // res.clearCookie("connect.sid");
  res.json({ message: "Logout successful" });
});

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
    successRedirect: `${process.env.FRONTEND_URL}`,
  })
);

// app.post(
//   "/api/files/upload",
//   upload.single("file"),
//   async (req: Request, res: Response) => {
//     if (!req.file) {
//       res.status(400).json({ message: "No file uploaded" });
//       return;
//     }

//     try {
//       // database code

//       res.status(200).json({
//         message: "File uploaded successfully",
//         file: {
//           filename: req.file.filename,
//           originalName: req.file.originalname,
//           size: req.file.size,
//           mimetype: req.file.mimetype,
//         },
//       });
//     } catch (err) {
//       console.error("Error uploading file", err);
//       res.status(500).json({ message: "Error uploading file" });
//     }
//   }
// );

// todd: multiple file upload

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
