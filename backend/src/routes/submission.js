const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

router.post('/submit', 
  authenticateToken, 
  authorizeRole('STUDENT'), 
  submissionController.submitThesis
);

router.get('/my-theses', 
  authenticateToken, 
  authorizeRole('STUDENT'), 
  submissionController.getStudentTheses
);

router.get('/:id', 
  authenticateToken, 
  submissionController.getThesisById
);

router.get('/:id/download', 
  authenticateToken, 
  submissionController.downloadThesis
);

router.patch('/:id/status',
  authenticateToken,
  authorizeRole('ADMIN'),
  submissionController.updateThesisStatus
);

router.delete('/:id',
  authenticateToken,
  authorizeRole('ADMIN'),
  submissionController.deleteThesis
);

module.exports = router;
