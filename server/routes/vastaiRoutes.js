import express from 'express';
import bodyParser from 'body-parser';
import { listGPUInstances } from '../controllers/vastaiController.js';

const router = express.Router();

// GET request to retrieve user data
router.get('/listInstances',bodyParser.json({ limit: "10mb" }), listGPUInstances);

export default router;
