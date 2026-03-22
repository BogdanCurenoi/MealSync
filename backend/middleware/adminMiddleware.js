const adminMiddleware = (req, res, next) => {
    if (!req.user || req.user.role_permission !== 99) {
        return res.status(403).json({ message: 'Admin access required' });
    }
    next();
};

module.exports = adminMiddleware;
