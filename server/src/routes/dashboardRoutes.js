const express = require('express');
const { getDashboardOverview, updateProfileRole } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/overview', protect, getDashboardOverview);
router.post('/role', protect, updateProfileRole);

module.exports = router;
