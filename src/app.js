import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";

import { globalApiHandler } from "./middlewares/globalError.middleware.js";
import { rateLimiter } from "./middlewares/rateLimit.middleware.js";

// ROUTERS (named exports)
import { authRouter } from "./routes/auth.route.js";
import { userRouter } from "./routes/user.routes.js";
import { questionRouter } from "./routes/question.route.js";
import { answerRouter } from "./routes/answer.route.js";
import { commentRouter } from "./routes/comment.route.js";
import { tagRouter } from "./routes/tag.route.js";
import { adminRouter } from "./routes/admin.route.js";

const app = express();

// 🔒 Security & Utility Middlewares
app.use(helmet());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true }));

app.use(
    cors({
        origin: true,
        credentials: true,
    })
);

app.use(rateLimiter);

// 🚀 API ROUTES
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/questions", questionRouter);
app.use("/api/v1/answers", answerRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/tags", tagRouter);
app.use("/api/v1/admin", adminRouter);

// 🛑 GLOBAL ERROR HANDLER
app.use(globalApiHandler);

// Export app for server.js
export { app };
