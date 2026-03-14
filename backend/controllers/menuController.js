const db = require('../db');

const getAllMenus = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const offset = (page - 1) * limit;

    const [menus] = await db.query('SELECT * FROM menus LIMIT ? OFFSET ?', [limit, offset]);
    const [[{ total }]] = await db.query('SELECT COUNT(*) as total FROM menus');

    res.json({ menus, total, page, totalPages: Math.ceil(total / limit) });
};


const getMenuById = async (req, res) => {
    const [rows] = await db.query('SELECT * FROM menus WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Menu not found' });

    const [meals] = await db.query(
        'SELECT m.* FROM meals m JOIN menu_meals mm ON m.id = mm.meal_id WHERE mm.menu_id = ?',
        [req.params.id]
    );

    res.json({ ...rows[0], meals });
};

module.exports = { getAllMenus, getMenuById };
