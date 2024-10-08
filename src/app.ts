import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import { userFromJWT } from "./middleware/user-from-jwt";
import { last_online } from "./middleware/online";
import "./config/passport";
import "./config/cloudinary";

import indexRouter from "./routes/index";
import usersRouter from "./routes/users";
import postsRouter from "./routes/posts";

const app = express();

app.use(cors());
app.use(compression());
app.use(helmet());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(userFromJWT);
app.use(last_online);

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/posts", postsRouter);

export default app;
