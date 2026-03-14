const db = require('../db');
const bcrypt = require('bcryptjs');

const getProfile = async (req, res) => {
    const [rows] = await db.query(
        'SELECT id, login_user, user_name, user_surname, user_age, user_email, user_address, loyalty_points FROM users WHERE id = ?',
        [req.user.id]
    );
    res.json(rows[0]);
};

const updateProfile = async (req, res) => {
    const { user_name, user_surname, user_age, user_email, user_address } = req.body;
    await db.query(
        'UPDATE users SET user_name=?, user_surname=?, user_age=?, user_email=?, user_address=? WHERE id=?',
        [user_name, user_surname, user_age, user_email, user_address, req.user.id]
    );
    res.json({ message: 'Profile updated' });
};

const changePassword = async (req, res) => {
    const { current_password, new_password } = req.body;
    const [rows] = await db.query('SELECT login_password FROM users WHERE id=?', [req.user.id]);
    const match = await bcrypt.compare(current_password, rows[0].login_password);
    if (!match) return res.status(400).json({ message: 'Current password is incorrect' });
    const hashed = await bcrypt.hash(new_password, 10);
    await db.query('UPDATE users SET login_password=? WHERE id=?', [hashed, req.user.id]);
    res.json({ message: 'Password changed' });
};

const getUserAlergies = async (req, res) => {
    const [all] = await db.query('SELECT * FROM alergies');
    const [userAlergies] = await db.query('SELECT alergy_id FROM user_alergies WHERE user_id=?', [req.user.id]);
    const selected = userAlergies.map(r => r.alergy_id);
    res.json({ all, selected });
};

const updateUserAlergies = async (req, res) => {
    const { alergy_ids } = req.body;
    await db.query('DELETE FROM user_alergies WHERE user_id=?', [req.user.id]);
    if (alergy_ids && alergy_ids.length > 0) {
        const values = alergy_ids.map(id => [req.user.id, id]);
        await db.query('INSERT INTO user_alergies (user_id, alergy_id) VALUES ?', [values]);
    }
    res.json({ message: 'Alergies updated' });
};

const getUserDiets = async (req, res) => {
    const [all] = await db.query('SELECT * FROM diets');
    const [userDiets] = await db.query('SELECT diet_id FROM user_diets WHERE user_id=?', [req.user.id]);
    const selected = userDiets.map(r => r.diet_id);
    res.json({ all, selected });
};

const updateUserDiets = async (req, res) => {
    const { diet_ids } = req.body;
    await db.query('DELETE FROM user_diets WHERE user_id=?', [req.user.id]);
    if (diet_ids && diet_ids.length > 0) {
        const values = diet_ids.map(id => [req.user.id, id]);
        await db.query('INSERT INTO user_diets (user_id, diet_id) VALUES ?', [values]);
    }
    res.json({ message: 'Diets updated' });
};

module.exports = { getProfile, updateProfile, changePassword, getUserAlergies, updateUserAlergies, getUserDiets, updateUserDiets };
