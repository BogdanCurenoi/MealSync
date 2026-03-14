const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
    getProfile,
    updateProfile,
    changePassword,
    getUserAlergies,
    updateUserAlergies,
    getUserDiets,
    updateUserDiets
} = require('../controllers/userController');

router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.put('/change-password', auth, changePassword);
router.get('/alergies', auth, getUserAlergies);
router.put('/alergies', auth, updateUserAlergies);
router.get('/diets', auth, getUserDiets);
router.put('/diets', auth, updateUserDiets);

module.exports = router;
