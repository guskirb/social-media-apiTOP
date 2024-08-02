import express from "express";
const router = express.Router();

import { get_users, create_user, log_in } from "../controllers/user-controller";

/* GET users listing. */
router.get("/", get_users);

router.post("/create", create_user);

router.post("/log-in", log_in);

export default router;
