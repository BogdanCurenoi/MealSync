const express = require('express');
const router = express.Router();
const { getAllMeals, getMealById } = require('../controllers/mealController');

router.get('/', getAllMeals);
router.get('/:id', getMealById);

module.exports = router;
