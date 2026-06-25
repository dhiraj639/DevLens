const express = require('express');
const { analyzeLeetcode, getLeetcodeAnalysis } = require('../controllers/leetcodeController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/analyze', protect, analyzeLeetcode);
router.get('/', protect, getLeetcodeAnalysis);

module.exports = router;
