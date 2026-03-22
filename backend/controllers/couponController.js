const db = require('../db');

const getCouponTypes = async (req, res) => {
    const [types] = await db.query('SELECT * FROM coupon_types');
    res.json(types);
};

const buyCoupon = async (req, res) => {
    const { coupon_type_id } = req.body;

    const [types] = await db.query('SELECT * FROM coupon_types WHERE id = ?', [coupon_type_id]);
    if (types.length === 0) return res.status(404).json({ message: 'Coupon type not found' });

    const coupon = types[0];

    const [userRows] = await db.query('SELECT loyalty_points FROM users WHERE id = ?', [req.user.id]);
    const userPoints = userRows[0].loyalty_points;

    if (userPoints < coupon.loyalty_cost) return res.status(400).json({ message: 'Not enough loyalty points' });

    await db.query('UPDATE users SET loyalty_points = loyalty_points - ? WHERE id = ?', [coupon.loyalty_cost, req.user.id]);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + coupon.expiry_days);

    await db.query(
        'INSERT INTO user_coupons (user_id, coupon_type_id, expires_at) VALUES (?, ?, ?)',
        [req.user.id, coupon_type_id, expiresAt]
    );

    const [updated] = await db.query('SELECT loyalty_points FROM users WHERE id = ?', [req.user.id]);
    res.json({ message: 'Coupon purchased', loyalty_points: updated[0].loyalty_points });
};

const getUserCoupons = async (req, res) => {
    const [coupons] = await db.query(
        `SELECT uc.*, ct.coupon_name, ct.discount_percent, ct.discount_fixed
         FROM user_coupons uc
         JOIN coupon_types ct ON uc.coupon_type_id = ct.id
         WHERE uc.user_id = ? AND uc.is_used = 0 AND uc.expires_at > NOW()
         ORDER BY uc.redeemed_at DESC`,
        [req.user.id]
    );
    res.json(coupons);
};

module.exports = { getCouponTypes, buyCoupon, getUserCoupons };
