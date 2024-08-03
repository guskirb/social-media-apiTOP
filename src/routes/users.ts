import express from "express";
const router = express.Router();

import { get_users, create_user, log_in, update_user } from "../controllers/user-controller";
import {
  send_request,
  accept_request,
  decline_request,
} from "../controllers/request-controller";

/* GET users listing. */
router.get("/", get_users);

router.post("/create", create_user);

router.post("/log-in", log_in);

router.post("/update", update_user)

router.post("/:id/request", send_request);

router.post("/:id/request/accept", accept_request);

router.post("/:id/request/decline", decline_request);

export default router;
