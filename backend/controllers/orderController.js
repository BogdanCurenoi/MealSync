const db = require('../db');

const placeOrder = async (req, res) => {
    const { items, user_coupon_id } = req.body;

    if (!items || items.length === 0) return res.status(400).json({ message: 'Cart is empty' });

    const total_price = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const delivery_cost = items.reduce((sum, i) => sum + i.delivery_cost, 0);

    const [result] = await db.query(
        'INSERT INTO orders (user_id, user_coupon_id, total_price, delivery_cost) VALUES (?,?,?,?)',
        [req.user.id, user_coupon_id || null, total_price, delivery_cost]
    );

    const orderId = result.insertId;

    for (const item of items) {
        await db.query(
            'INSERT INTO order_items (order_id, meal_id, menu_id, quantity, item_price) VALUES (?,?,?,?,?)',
            [orderId, item.meal_id || null, item.menu_id || null, item.quantity, item.price]
        );
    }

    res.status(201).json({ message: 'Order placed', order_id: orderId });
};


const getUserOrders = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const offset = (page - 1) * limit;

    const [orders] = await db.query(
        'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
        [req.user.id, limit, offset]
    );

    const [[{ total }]] = await db.query(
        'SELECT COUNT(*) as total FROM orders WHERE user_id = ?',
        [req.user.id]
    );

    for (const order of orders) {
        const [items] = await db.query(
            `SELECT oi.*, m.meal_name, mn.menu_name
             FROM order_items oi
             LEFT JOIN meals m ON oi.meal_id = m.id
             LEFT JOIN menus mn ON oi.menu_id = mn.id
             WHERE oi.order_id = ?`,
            [order.id]
        );
        order.items = items;
    }

    res.json({ orders, total, totalPages: Math.ceil(total / limit) });
};

module.exports = { placeOrder, getUserOrders };
