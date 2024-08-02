import express from "express";
const router = express.Router();

import { get_users, create_user } from "../controllers/user-controller";

/* GET users listing. */
router.get("/", get_users);

router.post("/create", create_user);

export default router;
