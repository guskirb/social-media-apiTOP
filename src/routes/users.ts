import express from "express";
const router = express.Router();
import passport from "passport";

import { upload } from "../config/multer";

import {
  get_users,
  create_user,
  log_in,
  update_user,
  get_user,
  get_me,
} from "../controllers/user-controller";
import {
  send_request,
  accept_request,
  decline_request,
  get_requests,
  cancel_request,
} from "../controllers/request-controller";
import { remove_friend } from "../controllers/friend-controller";
import { get_user_likes, get_user_posts } from "../controllers/post-controller";

/* GET users listing. */
router.get("/", get_users);

router.get("/me", passport.authenticate("jwt", { session: false }), get_me);

router.get(
  "/requests",
  passport.authenticate("jwt", { session: false }),
  get_requests
);

router.post("/create", create_user);

router.post("/login", log_in);

router.post(
  "/update",
  passport.authenticate("jwt", { session: false }),
  upload.fields([
    { name: "profileImg", maxCount: 1 },
    { name: "coverImg", maxCount: 1 },
  ]),
  update_user
);

router.get(
  "/:username",
  passport.authenticate("jwt", { session: false }),
  get_user
);

router.get(
  "/:username/posts",
  passport.authenticate("jwt", { session: false }),
  get_user_posts
);

router.get(
  "/:username/likes",
  passport.authenticate("jwt", { session: false }),
  get_user_likes
);

router.post("/:id/remove", remove_friend);

router.post(
  "/:id/request",
  passport.authenticate("jwt", { session: false }),
  send_request
);

router.post(
  "/:id/request/accept",
  passport.authenticate("jwt", { session: false }),
  accept_request
);

router.post(
  "/:id/request/decline",
  passport.authenticate("jwt", { session: false }),
  decline_request
);

router.post(
  "/:id/request/cancel",
  passport.authenticate("jwt", { session: false }),
  cancel_request
);

export default router;
