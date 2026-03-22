const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
    getPlans,
    subscribe,
    getMySubscription,
    cancelSubscription,
    updateSubscriptionMenus
} = require('../controllers/subscriptionController');

router.get('/plans', getPlans);
router.post('/', auth, subscribe);
router.get('/my', auth, getMySubscription);
router.put('/cancel', auth, cancelSubscription);
router.put('/menus', auth, updateSubscriptionMenus);

module.exports = router;
