import express from 'express';
import { ChatWithAI } from '../Controller/AI/aiController.js';

const aiRouter = express.Router();

aiRouter.post('/chat', ChatWithAI);

export default aiRouter;
