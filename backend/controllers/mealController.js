const db = require('../db');

const getAllMeals = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const offset = (page - 1) * limit;

    const { min_price, max_price, min_calories, max_calories, has_discount, vegan, user_id } = req.query;

    let conditions = [];
    let params = [];
    let countParams = [];

    if (min_price) { conditions.push('m.price >= ?'); params.push(min_price); countParams.push(min_price); }
    if (max_price) { conditions.push('m.price <= ?'); params.push(max_price); countParams.push(max_price); }
    if (min_calories) { conditions.push('m.calories >= ?'); params.push(min_calories); countParams.push(min_calories); }
    if (max_calories) { conditions.push('m.calories <= ?'); params.push(max_calories); countParams.push(max_calories); }
    if (has_discount === 'true') { conditions.push('m.discount > 0'); }
    if (vegan === 'true') { conditions.push('m.vegan_flag = 1'); }

    if (user_id) {
        conditions.push(`m.id NOT IN (
            SELECT ma.meal_id FROM meal_alergies ma
            WHERE ma.alergy_id IN (
                SELECT ua.alergy_id FROM user_alergies ua WHERE ua.user_id = ?
            )
        )`);
        params.push(user_id);
        countParams.push(user_id);
    }

    const where = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

    const [meals] = await db.query(
        `SELECT m.* FROM meals m ${where} LIMIT ? OFFSET ?`,
        [...params, limit, offset]
    );
    const [[{ total }]] = await db.query(
        `SELECT COUNT(*) as total FROM meals m ${where}`,
        countParams
    );

    res.json({ meals, total, page, totalPages: Math.ceil(total / limit) });
};

const getMealById = async (req, res) => {
    const [rows] = await db.query('SELECT * FROM meals WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Meal not found' });

    const [alergies] = await db.query(
        'SELECT a.* FROM alergies a JOIN meal_alergies ma ON a.id = ma.alergy_id WHERE ma.meal_id = ?',
        [req.params.id]
    );

    res.json({ ...rows[0], alergies });
};

module.exports = { getAllMeals, getMealById };
