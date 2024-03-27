import express from "express";
import { handleTranscribeRequest } from "../controllers/trnascribeController.js";
const router = express.Router();

router.post("/transcribe", handleTranscribeRequest);

export default router;
