import express from 'express';
import { getNews } from '../controllers/newsController.js';
import { analyzeNews } from '../controllers/openaiController.js';
const router = express.Router();

router.get('/news', getNews);
router.post('/analyze', analyzeNews);

export default router;