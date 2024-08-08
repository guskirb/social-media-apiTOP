import express from "express";
const router = express.Router();
import passport from "passport";

import {
  get_users,
  create_user,
  log_in,
  update_user,
  get_user,
  get_me,
  get_by_username,
} from "../controllers/user-controller";
import {
  send_request,
  accept_request,
  decline_request,
} from "../controllers/request-controller";
import { remove_friend } from "../controllers/friend-controller";

/* GET users listing. */
router.get("/", get_users);

router.get("/me", passport.authenticate("jwt", { session: false }), get_me);

router.post("/create", create_user);

router.post("/login", log_in);

router.post(
  "/update",
  passport.authenticate("jwt", { session: false }),
  update_user
);

router.get("/:username", get_by_username);

router.get("/:id", get_user);

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

export default router;
