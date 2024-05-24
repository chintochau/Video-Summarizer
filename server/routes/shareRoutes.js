import express from "express";
const router = express.Router();
import bodyParser from "body-parser";
import { renderSharePage } from "../controllers/shareController.js";

router.get("/share/:summaryId", renderSharePage);

export default router;