const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

router.post('/submit-review', 
  authenticateToken, 
  authorizeRole('REVIEWER', 'ADMIN'), 
  reviewController.submitReview
);

router.get('/thesis/:thesisId', 
  authenticateToken, 
  reviewController.getReviewsForThesis
);

router.get('/reviewer/dashboard', 
  authenticateToken, 
  authorizeRole('REVIEWER', 'ADMIN'), 
  reviewController.getReviewerDashboard
);

router.post('/add-comment', 
  authenticateToken, 
  reviewController.addComment
);

module.exports = router;
