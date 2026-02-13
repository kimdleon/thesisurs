const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');
const { authenticateToken } = require('../middleware/auth');

router.get('/theses', 
  searchController.searchTheses
);

router.get('/filters', 
  searchController.getFilters
);

module.exports = router;
