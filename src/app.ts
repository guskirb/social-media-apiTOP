import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { userFromJWT } from "./middleware/user-from-jwt";
import "./config/passport";
import "./config/cloudinary";

import indexRouter from "./routes/index";
import usersRouter from "./routes/users";
import postsRouter from "./routes/posts";

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(userFromJWT);

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/posts", postsRouter);

export default app;
