import express from "express";
const router = express.Router();
import bodyParser from "body-parser";
import { renderSharePage } from "../controllers/shareController.js";

router.get("/:summaryId", renderSharePage);

export default router;