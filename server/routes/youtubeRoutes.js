import express from 'express';
import bodyParser from 'body-parser';
import {getYoutubeTranscript,getYoutubeAudio} from "../controllers/youtubeController.js"
import cors from "cors";

const router = express.Router();

const exposedHeaders = {exposedHeaders: ["Content-Disposition"]}
const jsonBodyparser = bodyParser.json({ limit: "10mb" })

// GET request to retrieve user data
router.get('/youtubeTranscript/:youtubeId',jsonBodyparser,getYoutubeTranscript);
router.post('/downloadYoutubeAudio',cors(exposedHeaders),jsonBodyparser,getYoutubeAudio )



export default router;
