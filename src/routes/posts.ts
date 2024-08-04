import express from "express";
const router = express.Router();
import passport from "passport";

import { upload } from "../config/multer";

import {
  create_post,
  delete_post,
  get_post,
  like_post,
  unlike_post,
} from "../controllers/post-controller";

router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  upload.single("image"),
  create_post
);

router.get("/:id", passport.authenticate("jwt", { session: false }), get_post);

router.post(
  "/:id/delete",
  passport.authenticate("jwt", { session: false }),
  delete_post
);

router.post(
  "/:id/like",
  passport.authenticate("jwt", { session: false }),
  like_post
);

router.post(
  "/:id/unlike",
  passport.authenticate("jwt", { session: false }),
  unlike_post
);

export default router;
