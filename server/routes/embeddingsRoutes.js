import express from "express";
import { createEmbeddings } from "../controllers/embeddingsController.js";
const router = express.Router();
import bodyParser from "body-parser";

router.post("/save-embeddings",bodyParser.json({ limit: "10mb" }), createEmbeddings);

export default router;