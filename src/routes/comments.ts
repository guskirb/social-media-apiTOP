import express from "express";
const router = express.Router({ mergeParams: true });
import passport from "passport";

import { upload } from "../config/multer";

import { create_comment } from "../controllers/comment-controller";

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  upload.single("image"),
  create_comment
);

export default router;
