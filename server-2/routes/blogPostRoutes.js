import express from "express";
import { createBlogPost, getBlogPosts, updateBlogPost, deleteBlogPost } from "../controllers/blogPostController.js";
const router = express.Router();
import bodyParser from "body-parser";

router.post("/createBlogPost",bodyParser.json({ limit: "10mb" }), createBlogPost);
router.get("/getBlogPost",bodyParser.json({ limit: "10mb" }), getBlogPosts);
router.post("/updateBlogPost",bodyParser.json({ limit: "10mb" }), updateBlogPost);
router.post("/deleteBlogPost",bodyParser.json({ limit: "10mb" }), deleteBlogPost);

export default router;