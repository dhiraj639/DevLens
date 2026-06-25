const express = require('express');
const { analyzeGithub, getGithubAnalysis } = require('../controllers/githubController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/analyze', protect, analyzeGithub);
router.get('/', protect, getGithubAnalysis);

module.exports = router;
