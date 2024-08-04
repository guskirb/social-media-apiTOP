import express from "express";
const router = express.Router();
import passport from "passport";

import { upload } from "../config/multer";

import { create_post, delete_posts } from "../controllers/post-controller";

router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  upload.single("image"),
  create_post
);

export default router;
