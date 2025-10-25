// src/middleware/auth.js
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next(); 
    }
    res.status(401).json({ message: 'Authentication required. Please log in.' });
};

const isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
        return next(); 
    }
    res.status(403).json({ message: 'Forbidden. Admin access required.' });
};

module.exports = { isAuthenticated, isAdmin };