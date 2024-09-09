// middlewares/auth.js

function authenticateSession(req, res, next) {
    if (req.session && req.session.user) {
        // ตรวจสอบ session หรือ user ที่เก็บอยู่ใน session
        next();
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
}

module.exports = authenticateSession;
