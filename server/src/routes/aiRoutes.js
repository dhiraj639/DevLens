const express = require('express');
const { getAIReview, getAIGapAnalysis, getAIRoadmap, chatWithAssistant } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/review', protect, getAIReview);
router.get('/gap-analysis', protect, getAIGapAnalysis);
router.get('/roadmap', protect, getAIRoadmap);
router.post('/chat', protect, chatWithAssistant);

module.exports = router;
