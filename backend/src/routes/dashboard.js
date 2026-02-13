const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

router.get('/admin', 
  authenticateToken, 
  authorizeRole('ADMIN'), 
  dashboardController.getAdminDashboard
);

router.get('/student', 
  authenticateToken, 
  authorizeRole('STUDENT'), 
  dashboardController.getStudentDashboard
);

router.get('/reviewer', 
  authenticateToken, 
  authorizeRole('REVIEWER', 'ADMIN'), 
  dashboardController.getReviewerDashboard
);

module.exports = router;
