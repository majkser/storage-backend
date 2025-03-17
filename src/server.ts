import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import "./auth";
import passport from "passport";

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.get("/auth/google", (req: Request, res: Response) => {
  passport.authenticate("google", { scope: ["profile", "email"] });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
