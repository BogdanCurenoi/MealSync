const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getCouponTypes, buyCoupon, getUserCoupons } = require('../controllers/couponController');

router.get('/types', getCouponTypes);
router.post('/buy', auth, buyCoupon);
router.get('/my', auth, getUserCoupons);

module.exports = router;
