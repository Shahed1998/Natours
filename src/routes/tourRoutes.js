const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tourController');

router.route('/api/v1/tours').get(tourController.getAllTours);

module.exports = router;
