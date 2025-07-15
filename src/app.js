import express from "express";
import cookieParser from "cookie-parser";
import cors from 'cors';
import morgan from "morgan";
import helmet from "helmet";

import { globalApiHandler } from "./middlewares/globalError.middleware.js";

const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json({
    limit: '100kbe'
}));
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.urlencoded({ extended: true }))

// routes

// app.use(globalApiHandler());

export { app };