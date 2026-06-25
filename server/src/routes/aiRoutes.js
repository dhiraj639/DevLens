const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { 
  getAIReview, 
  getAIGapAnalysis, 
  getAIRoadmap, 
  chatWithAssistant,
  getChatHistory,
  clearChatHistory 
} = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `chat_${req.user._id}_${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB limit
});

router.get('/review', protect, getAIReview);
router.get('/gap-analysis', protect, getAIGapAnalysis);
router.get('/roadmap', protect, getAIRoadmap);
router.post('/chat', protect, upload.single('file'), chatWithAssistant);
router.get('/history', protect, getChatHistory);
router.delete('/history', protect, clearChatHistory);

module.exports = router;

