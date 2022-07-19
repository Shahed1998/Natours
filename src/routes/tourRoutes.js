const express = require('express');
const tourController = require('../controllers/tourController');

const router = express.Router();

router.param('id', tourController.checkID);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.checkBody, tourController.addTour); // chaining middleware

router.route('/:id').get(tourController.getAllTours);

module.exports = router;
