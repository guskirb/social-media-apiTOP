import express from "express";
const router = express.Router();
import passport from "passport";

import {
  get_users,
  create_user,
  log_in,
  update_user,
} from "../controllers/user-controller";
import {
  send_request,
  accept_request,
  decline_request,
} from "../controllers/request-controller";

/* GET users listing. */
router.get("/", get_users);

router.post("/create", create_user);

router.post("/log-in", log_in);

router.post(
  "/update",
  passport.authenticate("jwt", { session: false }),
  update_user
);

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
