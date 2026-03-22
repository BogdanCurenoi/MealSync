const db = require('../db');
const fs = require('fs');
const path = require('path');

const getStats = async (req, res) => {
    const [[{ total_users }]] = await db.query('SELECT COUNT(*) as total_users FROM users');
    const [[{ total_orders }]] = await db.query('SELECT COUNT(*) as total_orders FROM orders');
    const [[{ total_revenue }]] = await db.query('SELECT COALESCE(SUM(total_price + delivery_cost), 0) as total_revenue FROM orders');
    const [[{ active_subs }]] = await db.query('SELECT COUNT(*) as active_subs FROM user_subscriptions WHERE is_active = 1');

    const [monthly] = await db.query(`
        SELECT DATE_FORMAT(created_at, '%Y-%m') as month,
               COUNT(*) as orders,
               SUM(total_price + delivery_cost) as revenue
        FROM orders
        GROUP BY month
        ORDER BY month DESC
        LIMIT 12
    `);

    const [topMeals] = await db.query(`
        SELECT m.meal_name, SUM(oi.quantity) as total_sold
        FROM order_items oi
        JOIN meals m ON oi.meal_id = m.id
        WHERE oi.meal_id IS NOT NULL
        GROUP BY oi.meal_id
        ORDER BY total_sold DESC
        LIMIT 5
    `);

    const [subsByType] = await db.query(`
        SELECT st.type_name, COUNT(*) as count
        FROM user_subscriptions us
        JOIN subscription_plans sp ON us.plan_id = sp.id
        JOIN subscription_types st ON sp.subscription_type_id = st.id
        WHERE us.is_active = 1
        GROUP BY st.type_name
    `);

    res.json({ total_users, total_orders, total_revenue, active_subs, monthly: monthly.reverse(), topMeals, subsByType });
};

const getUsers = async (req, res) => {
    const [users] = await db.query(
        `SELECT u.id, u.login_user, u.user_name, u.user_surname, u.user_email,
         u.user_address, u.loyalty_points, r.role_name
         FROM users u JOIN roles r ON u.role = r.id
         ORDER BY u.id DESC`
    );
    res.json(users);
};

const getAllergies = async (req, res) => {
    const [rows] = await db.query('SELECT * FROM alergies ORDER BY alergy_name');
    res.json(rows);
};

const deleteUser = async (req, res) => {
    await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ message: 'User deleted' });
};

const getMeals = async (req, res) => {
    const [meals] = await db.query('SELECT * FROM meals ORDER BY id DESC');
    for (const meal of meals) {
        const [alergies] = await db.query(
            `SELECT a.id, a.alergy_name FROM meal_alergies ma JOIN alergies a ON ma.alergy_id = a.id WHERE ma.meal_id = ?`,
            [meal.id]
        );
        meal.alergies = alergies;
    }
    res.json(meals);
};

const createMeal = async (req, res) => {
    const { meal_name, description, calories, price, discount, delivery_cost, vegan_flag, alergy_ids } = req.body;
    const image_url = req.file ? `/uploads/meals/${req.file.filename}` : null;
    const [result] = await db.query(
        'INSERT INTO meals (meal_name, description, calories, price, discount, delivery_cost, vegan_flag, image_url) VALUES (?,?,?,?,?,?,?,?)',
        [meal_name, description, calories, price, discount || 0, delivery_cost, vegan_flag || 0, image_url]
    );
    const ids = Array.isArray(alergy_ids) ? alergy_ids : alergy_ids ? JSON.parse(alergy_ids) : [];
    if (ids.length > 0) {
        const values = ids.map(id => [result.insertId, id]);
        await db.query('INSERT INTO meal_alergies (meal_id, alergy_id) VALUES ?', [values]);
    }
    res.status(201).json({ message: 'Meal created' });
};

const updateMeal = async (req, res) => {
    const { meal_name, description, calories, price, discount, delivery_cost, vegan_flag, alergy_ids } = req.body;
    let image_url = req.body.existing_image;

    if (req.file) {
        image_url = `/uploads/meals/${req.file.filename}`;
        if (req.body.existing_image) {
            const oldPath = path.join(__dirname, '..', req.body.existing_image);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
    }

    await db.query(
        'UPDATE meals SET meal_name=?, description=?, calories=?, price=?, discount=?, delivery_cost=?, vegan_flag=?, image_url=? WHERE id=?',
        [meal_name, description, calories, price, discount || 0, delivery_cost, vegan_flag || 0, image_url, req.params.id]
    );

    await db.query('DELETE FROM meal_alergies WHERE meal_id = ?', [req.params.id]);
    const ids = Array.isArray(alergy_ids) ? alergy_ids : alergy_ids ? JSON.parse(alergy_ids) : [];
    if (ids.length > 0) {
        const values = ids.map(id => [req.params.id, id]);
        await db.query('INSERT INTO meal_alergies (meal_id, alergy_id) VALUES ?', [values]);
    }

    res.json({ message: 'Meal updated' });
};

const deleteMeal = async (req, res) => {
    const [rows] = await db.query('SELECT image_url FROM meals WHERE id = ?', [req.params.id]);
    if (rows.length > 0 && rows[0].image_url) {
        const oldPath = path.join(__dirname, '..', rows[0].image_url);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }
    await db.query('DELETE FROM meal_alergies WHERE meal_id = ?', [req.params.id]);
    await db.query('DELETE FROM meals WHERE id = ?', [req.params.id]);
    res.json({ message: 'Meal deleted' });
};

const getMenus = async (req, res) => {
    const [menus] = await db.query('SELECT * FROM menus ORDER BY id DESC');
    for (const menu of menus) {
        const [meals] = await db.query(
            `SELECT m.id, m.meal_name FROM menu_meals mm JOIN meals m ON mm.meal_id = m.id WHERE mm.menu_id = ?`,
            [menu.id]
        );
        menu.meals = meals;
    }
    res.json(menus);
};

const createMenu = async (req, res) => {
    const { menu_name, description, price, discount, delivery_cost, vegan_flag, meal_ids } = req.body;
    const [result] = await db.query(
        'INSERT INTO menus (menu_name, description, price, discount, delivery_cost, vegan_flag) VALUES (?,?,?,?,?,?)',
        [menu_name, description, price, discount || 0, delivery_cost, vegan_flag || 0]
    );
    if (meal_ids && meal_ids.length > 0) {
        const values = meal_ids.map(id => [result.insertId, id]);
        await db.query('INSERT INTO menu_meals (menu_id, meal_id) VALUES ?', [values]);
    }
    res.status(201).json({ message: 'Menu created' });
};

const updateMenu = async (req, res) => {
    const { menu_name, description, price, discount, delivery_cost, vegan_flag, meal_ids } = req.body;
    await db.query(
        'UPDATE menus SET menu_name=?, description=?, price=?, discount=?, delivery_cost=?, vegan_flag=? WHERE id=?',
        [menu_name, description, price, discount || 0, delivery_cost, vegan_flag || 0, req.params.id]
    );
    if (meal_ids) {
        await db.query('DELETE FROM menu_meals WHERE menu_id = ?', [req.params.id]);
        if (meal_ids.length > 0) {
            const values = meal_ids.map(id => [req.params.id, id]);
            await db.query('INSERT INTO menu_meals (menu_id, meal_id) VALUES ?', [values]);
        }
    }
    res.json({ message: 'Menu updated' });
};

const deleteMenu = async (req, res) => {
    await db.query('DELETE FROM menus WHERE id = ?', [req.params.id]);
    res.json({ message: 'Menu deleted' });
};

const getDiets = async (req, res) => {
    const [diets] = await db.query('SELECT * FROM diets ORDER BY id DESC');
    for (const diet of diets) {
        const [menus] = await db.query(
            `SELECT m.id, m.menu_name FROM diet_menus dm JOIN menus m ON dm.menu_id = m.id WHERE dm.diet_id = ?`,
            [diet.id]
        );
        diet.menus = menus;
    }
    res.json(diets);
};

const createDiet = async (req, res) => {
    const { diet_name, description, menu_ids } = req.body;
    const [result] = await db.query(
        'INSERT INTO diets (diet_name, description) VALUES (?,?)',
        [diet_name, description]
    );
    if (menu_ids && menu_ids.length > 0) {
        const values = menu_ids.map(id => [result.insertId, id]);
        await db.query('INSERT INTO diet_menus (diet_id, menu_id) VALUES ?', [values]);
    }
    res.status(201).json({ message: 'Diet created' });
};

const updateDiet = async (req, res) => {
    const { diet_name, description, menu_ids } = req.body;
    await db.query(
        'UPDATE diets SET diet_name=?, description=? WHERE id=?',
        [diet_name, description, req.params.id]
    );
    if (menu_ids) {
        await db.query('DELETE FROM diet_menus WHERE diet_id = ?', [req.params.id]);
        if (menu_ids.length > 0) {
            const values = menu_ids.map(id => [req.params.id, id]);
            await db.query('INSERT INTO diet_menus (diet_id, menu_id) VALUES ?', [values]);
        }
    }
    res.json({ message: 'Diet updated' });
};

const deleteDiet = async (req, res) => {
    await db.query('DELETE FROM diets WHERE id = ?', [req.params.id]);
    res.json({ message: 'Diet deleted' });
};

const getOrders = async (req, res) => {
    const [orders] = await db.query(
        `SELECT o.*, u.login_user, u.user_name, u.user_surname
         FROM orders o JOIN users u ON o.user_id = u.id
         ORDER BY o.created_at DESC LIMIT 50`
    );
    for (const order of orders) {
        const [items] = await db.query(
            `SELECT oi.*, m.meal_name, mn.menu_name FROM order_items oi
             LEFT JOIN meals m ON oi.meal_id = m.id
             LEFT JOIN menus mn ON oi.menu_id = mn.id
             WHERE oi.order_id = ?`,
            [order.id]
        );
        order.items = items;
    }
    res.json(orders);
};

module.exports = {
    getStats, getUsers, deleteUser,
    getAllergies,
    getMeals, createMeal, updateMeal, deleteMeal,
    getMenus, createMenu, updateMenu, deleteMenu,
    getDiets, createDiet, updateDiet, deleteDiet,
    getOrders
};
