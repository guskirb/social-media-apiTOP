import express from "express";
const router = express.Router();

import { get_users, create_user, log_in } from "../controllers/user-controller";
import { send_request, accept_request } from "../controllers/request-controller";

/* GET users listing. */
router.get("/", get_users);

router.post("/create", create_user);

router.post("/log-in", log_in);

router.post("/:id/request", send_request);

router.post("/:id/request/accept", accept_request);

export default router;
