import express from 'express';
import userController from '../controllers/userController.js';
import bodyParser from 'body-parser';

const router = express.Router();

// GET request to retrieve user data
router.get('/:email',bodyParser.json({ limit: "10mb" }), userController.getUserData);

// POST request to create a user account
router.post('/new-user',bodyParser.json({ limit: "10mb" }), userController.createUserAccount);

// POST request to purchase credits
router.post('/purchase-credits',bodyParser.json({ limit: "10mb" }), userController.purchaseCredits);

export default router;
