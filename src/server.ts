import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import "./controllers/auth";
import passport from "passport";
import session from "express-session";
import { User } from "./models/userModel";
import fileRoutes from "./routes/file.routes";
import authRoutes from "./routes/authRoutes";
import linkRoutes from "./routes/linkRoutes";
import fileAccessRoutes from "./routes/fileAccessRoutes";
import { getUserIdByEmail } from "./controllers/userController";

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
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    },
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
    const adminEmails = (process.env.ADMIN_EMAILS || "").split(",");
    res.json({
      id,
      username,
      email,
      photo,
      isAdmin: adminEmails.includes(email),
    });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});

app.get("/api/user/validate-session", (req: Request, res: Response) => {
  if (req.user) {
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
});

app.get("/api/user/email/:email", async (req: Request, res: Response) => {
  try {
    const userId = await getUserIdByEmail(req.params.email);
    if (userId) {
      res.json({ userId });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user ID" });
  }
});

app.use("/api/auth", authRoutes);

app.use("/api/files", fileRoutes);

app.use("/api/link", linkRoutes);

app.use("/api/file-access", fileAccessRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
