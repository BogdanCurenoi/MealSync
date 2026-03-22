const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');
const multer = require('multer');
const path = require('path');
const {
    getStats,
    getUsers, deleteUser,
    getMeals, createMeal, updateMeal, deleteMeal,
    getMenus, createMenu, updateMenu, deleteMenu,
    getDiets, createDiet, updateDiet, deleteDiet,
    getOrders, getAllergies 
} = require('../controllers/adminController');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/meals/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.use(auth, admin);

router.get('/stats', getStats);

router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);

router.get('/meals', getMeals);
router.post('/meals', upload.single('image'), createMeal);
router.put('/meals/:id', upload.single('image'), updateMeal);
router.delete('/meals/:id', deleteMeal);

router.get('/menus', getMenus);
router.post('/menus', createMenu);
router.put('/menus/:id', updateMenu);
router.delete('/menus/:id', deleteMenu);

router.get('/diets', getDiets);
router.post('/diets', createDiet);
router.put('/diets/:id', updateDiet);
router.delete('/diets/:id', deleteDiet);

router.get('/orders', getOrders);
router.get('/allergies', getAllergies);

module.exports = router;
