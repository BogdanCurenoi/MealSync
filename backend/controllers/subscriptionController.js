const db = require('../db');

const getPlans = async (req, res) => {
    const [plans] = await db.query(
        `SELECT sp.*, st.type_name, st.price_per_month, st.daily_loyalty_points,
         st.max_daily_menus, st.delivery_discount
         FROM subscription_plans sp
         JOIN subscription_types st ON sp.subscription_type_id = st.id
         ORDER BY st.id, sp.duration_months`
    );
    res.json(plans);
};

const subscribe = async (req, res) => {
    const { plan_id, menu_ids } = req.body;

    const [existing] = await db.query(
        'SELECT id FROM user_subscriptions WHERE user_id = ? AND is_active = 1',
        [req.user.id]
    );
    if (existing.length > 0) return res.status(400).json({ message: 'You already have an active subscription' });

    const [plans] = await db.query(
        `SELECT sp.*, st.price_per_month, st.max_daily_menus, st.daily_loyalty_points, st.delivery_discount, st.type_name
         FROM subscription_plans sp
         JOIN subscription_types st ON sp.subscription_type_id = st.id
         WHERE sp.id = ?`,
        [plan_id]
    );
    if (plans.length === 0) return res.status(404).json({ message: 'Plan not found' });

    const plan = plans[0];

    if (!menu_ids || menu_ids.length === 0 || menu_ids.length > plan.max_daily_menus)
        return res.status(400).json({ message: `Please select up to ${plan.max_daily_menus} menu(s)` });

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + plan.duration_months);

    const [result] = await db.query(
        'INSERT INTO user_subscriptions (user_id, plan_id, start_date, end_date) VALUES (?,?,?,?)',
        [req.user.id, plan_id, startDate, endDate]
    );

    const subId = result.insertId;
    const menuValues = menu_ids.map(id => [subId, id]);
    await db.query('INSERT INTO subscription_menus (user_subscription_id, menu_id) VALUES ?', [menuValues]);

    res.status(201).json({ message: 'Subscribed successfully' });
};

const getMySubscription = async (req, res) => {
    const [subs] = await db.query(
        `SELECT us.*, sp.duration_months, sp.discount_percent,
         st.type_name, st.price_per_month, st.daily_loyalty_points, st.max_daily_menus, st.delivery_discount
         FROM user_subscriptions us
         JOIN subscription_plans sp ON us.plan_id = sp.id
         JOIN subscription_types st ON sp.subscription_type_id = st.id
         WHERE us.user_id = ? AND us.is_active = 1`,
        [req.user.id]
    );

    if (subs.length === 0) return res.json(null);

    const sub = subs[0];
    const [menus] = await db.query(
        `SELECT m.id, m.menu_name FROM subscription_menus sm
         JOIN menus m ON sm.menu_id = m.id
         WHERE sm.user_subscription_id = ?`,
        [sub.id]
    );
    sub.menus = menus;
    sub.monthly_price = +(sub.price_per_month * (1 - sub.discount_percent / 100)).toFixed(2);
    sub.total_paid = +(sub.monthly_price * sub.duration_months).toFixed(2);

    res.json(sub);
};

const cancelSubscription = async (req, res) => {
    await db.query(
        'UPDATE user_subscriptions SET is_active = 0 WHERE user_id = ? AND is_active = 1',
        [req.user.id]
    );
    res.json({ message: 'Subscription cancelled' });
};

const updateSubscriptionMenus = async (req, res) => {
    const { menu_ids } = req.body;

    const [subs] = await db.query(
        `SELECT us.id, st.max_daily_menus FROM user_subscriptions us
         JOIN subscription_plans sp ON us.plan_id = sp.id
         JOIN subscription_types st ON sp.subscription_type_id = st.id
         WHERE us.user_id = ? AND us.is_active = 1`,
        [req.user.id]
    );
    if (subs.length === 0) return res.status(404).json({ message: 'No active subscription' });

    const sub = subs[0];
    if (!menu_ids || menu_ids.length === 0 || menu_ids.length > sub.max_daily_menus)
        return res.status(400).json({ message: `Please select up to ${sub.max_daily_menus} menu(s)` });

    await db.query('DELETE FROM subscription_menus WHERE user_subscription_id = ?', [sub.id]);
    const menuValues = menu_ids.map(id => [sub.id, id]);
    await db.query('INSERT INTO subscription_menus (user_subscription_id, menu_id) VALUES ?', [menuValues]);

    res.json({ message: 'Menus updated' });
};

module.exports = { getPlans, subscribe, getMySubscription, cancelSubscription, updateSubscriptionMenus };
