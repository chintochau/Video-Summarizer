import express from 'express';
import bodyParser from 'body-parser';
import { generateSpeech } from '../controllers/ttsController.js';

const router = express.Router();

// GET request to retrieve user data
router.post('/tts',bodyParser.json({ limit: "10mb" }), generateSpeech)

export default router;
