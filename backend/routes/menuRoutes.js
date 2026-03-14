const express = require('express');
const router = express.Router();
const { getAllMenus, getMenuById } = require('../controllers/menuController');

router.get('/', getAllMenus);
router.get('/:id', getMenuById);

module.exports = router;
