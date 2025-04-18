import express from 'express';
import bodyParser from 'body-parser';
import { listGPUInstances, startFirstInstance, stopFirstInstance } from '../controllers/vastaiController.js';

const router = express.Router();

// GET request to retrieve user data
router.get('/listInstances',bodyParser.json(), listGPUInstances);
router.put('/startFirstInstance',bodyParser.json(), startFirstInstance);
router.put('/stopFirstInstance',bodyParser.json(), stopFirstInstance);

export default router;
