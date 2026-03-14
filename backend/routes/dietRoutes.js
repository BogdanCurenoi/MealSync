const express = require('express');
const router = express.Router();
const { getAllDiets, getDietById } = require('../controllers/dietController');

router.get('/', getAllDiets);
router.get('/:id', getDietById);

module.exports = router;
