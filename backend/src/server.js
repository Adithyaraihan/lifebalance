import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import sleepRouter from "./modules/scoreSleep/scoreSleep.route.js";
import fitRouter from "./modules/googlefit/login.js";
import stepRouter from "./modules/step/steps.route.js";
import bodyMetricRouter from "./modules/bmi/bmi.route.js";
import articleRouter from "./modules/article/article.route.js";
import habitRouter from "./modules/habit/habit.route.js";
import todoRouter from "./modules/todo/todo.route.js";
import aiRouter from "./modules/aiChat/aiChat.routes.js";
import authRouter from "./modules/auth/login.route.js";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/googlefit", fitRouter);
app.use("/api/step", stepRouter);
app.use("/api/sleep", sleepRouter);
app.use("/api/bmi", bodyMetricRouter);
app.use("/api/article", articleRouter);
app.use("/api/habits", habitRouter);
app.use("/api/todo", todoRouter);
app.use("/api/aichat", aiRouter);
app.use("/api/auth", authRouter);

app.listen(5000, () =>
  console.log("\n✅ Server berjalan di http://localhost:5000")
);
