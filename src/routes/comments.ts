import express from "express";
const router = express.Router({ mergeParams: true });
import passport from "passport";

import { upload } from "../config/multer";

import {
  create_comment,
  delete_comment,
} from "../controllers/comment-controller";

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  upload.single("image"),
  create_comment
);

router.post(
  "/:commentId/delete",
  passport.authenticate("jwt", { session: false }),
  delete_comment
);

export default router;
