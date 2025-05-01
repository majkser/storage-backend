import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import "./controllers/auth";
import passport from "passport";
import session from "express-session";
import { User } from "./models/userModel";
import fileRoutes from "./routes/file.routes";
import authRoutes from "./routes/authRoutes";

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

app.use("/api/auth", authRoutes);

app.use("/api/files", fileRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
