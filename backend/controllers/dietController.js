const db = require('../db');

const getAllDiets = async (req, res) => {
    const [diets] = await db.query('SELECT * FROM diets');
    res.json(diets);
};

const getDietById = async (req, res) => {
    const [rows] = await db.query('SELECT * FROM diets WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Diet not found' });

    const [menus] = await db.query(
        'SELECT mn.* FROM menus mn JOIN diet_menus dm ON mn.id = dm.menu_id WHERE dm.diet_id = ?',
        [req.params.id]
    );

    res.json({ ...rows[0], menus });
};

module.exports = { getAllDiets, getDietById };
