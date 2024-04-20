import express from "express";
import { createEmbeddings, vectorSearch } from "../controllers/embeddingsController.js";
const router = express.Router();
import bodyParser from "body-parser";

router.post("/save-embeddings",bodyParser.json({ limit: "10mb" }), createEmbeddings);
router.post("/vector-search",bodyParser.json({ limit: "10mb" }), vectorSearch);

export default router;