import express from 'express';
import { getRecommendations } from '../controllers/recommendationsController.js';

const router = express.Router();
router.get('/:productId', getRecommendations);
export default router;
