import express from 'express';
import { ChatWithAI, PredictPrice } from '../Controller/AI/aiController.js';
import protect from '../middleware/authMiddle.js';

const aiRouter = express.Router();

aiRouter.post('/chat', protect, ChatWithAI);
aiRouter.post('/predict-price', protect, PredictPrice);

export default aiRouter;
