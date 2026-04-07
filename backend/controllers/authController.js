const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    const { login_user, login_password, user_name, user_surname, user_age, user_email, user_address } = req.body;

    const [existing] = await db.query('SELECT id FROM users WHERE login_user = ?', [login_user]);
    if (existing.length > 0) return res.status(400).json({ message: 'Username already taken' });

    const hashed = await bcrypt.hash(login_password, 10);

    const [roleRows] = await db.query('SELECT id FROM roles WHERE role_name = ?', ['client']);
    const roleId = roleRows[0].id;

    await db.query(
        'INSERT INTO users (login_user, login_password, role, user_name, user_surname, user_age, user_email, user_address, loyalty_points) VALUES (?,?,?,?,?,?,?,?,0)',
        [login_user, hashed, roleId, user_name, user_surname, user_age, user_email, user_address]
    );

    res.status(201).json({ message: 'Registered successfully' });
};

const login = async (req, res) => {
    const { login_user, login_password } = req.body;

    const [rows] = await db.query(
        `SELECT u.*, r.role_permission FROM users u
         JOIN roles r ON u.role = r.id
         WHERE u.login_user = ?`,
        [login_user]
    );
    if (rows.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

    const user = rows[0];
    const match = await bcrypt.compare(login_password, user.login_password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
        { id: user.id, role: user.role, role_permission: user.role_permission },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    const cookieOptions = {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: 'none',
        secure: true,
        path: '/'
    };

    res.cookie('mealsync_token', token, cookieOptions);

    res.json({
        id: user.id,
        login_user: user.login_user,
        user_name: user.user_name,
        user_surname: user.user_surname,
        role: user.role,
        role_permission: user.role_permission,
        loyalty_points: user.loyalty_points
    });
};

const logout = (req, res) => {
    res.clearCookie('mealsync_token', {
        sameSite: 'none',
        secure: true,
        path: '/'
    });
    res.json({ message: 'Logged out' });
};

const me = async (req, res) => {
    const [rows] = await db.query(
        `SELECT u.id, u.login_user, u.user_name, u.user_surname, u.role, u.loyalty_points, r.role_permission
         FROM users u JOIN roles r ON u.role = r.id
         WHERE u.id = ?`,
        [req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json(rows[0]);
};

module.exports = { register, login, logout, me };
