import express from "express";
const router = express.Router();

import { get_users } from "../controllers/user-controller";

/* GET users listing. */
router.get("/", get_users);

module.exports = router;
