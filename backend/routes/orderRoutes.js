const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { placeOrder, getUserOrders } = require('../controllers/orderController');

router.post('/', auth, placeOrder);
router.get('/my', auth, getUserOrders);

module.exports = router;
