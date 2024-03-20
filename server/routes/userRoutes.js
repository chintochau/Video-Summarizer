import express from 'express';
import userController from '../controllers/userController.js';

const router = express.Router();

// GET request to retrieve user data
router.get('/:email', userController.getUserData);

// POST request to create a user account
router.post('/new-user', userController.createUserAccount);

// POST request to purchase credits
router.post('/purchase-credits', userController.purchaseCredits);

export default router;
