import express from "express";
import { createEmbeddings, vectorSearch,getEmbeddingCollectionAndVideos,answerQuestions } from "../controllers/embeddingsController.js";
const router = express.Router();
import bodyParser from "body-parser";

router.post("/save-embeddings",bodyParser.json({ limit: "10mb" }), createEmbeddings);
router.post("/vector-search",bodyParser.json({ limit: "10mb" }), vectorSearch);
// get embedding collection with userId
router.get("/get-embeddings/:userId", getEmbeddingCollectionAndVideos);
router.post("/answer-questions",bodyParser.json({ limit: "10mb" }), answerQuestions);


export default router;

