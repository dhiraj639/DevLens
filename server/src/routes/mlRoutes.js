const express = require('express');
const { runMLPredictions } = require('../controllers/mlController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/predict', protect, runMLPredictions);

module.exports = router;
