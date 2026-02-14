export const authenticateAdmin = (req, res, next) => {
    const secretInfo = req.headers['x-admin-secret'];
    const authHeader = req.headers['authorization'];

    let token = secretInfo;

    // Support Bearer token
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    }

    if (!token || token !== process.env.ADMIN_SECRET_KEY) {
        return res.status(401).json({ error: 'Unauthorized: Invalid Admin Credentials' });
    }

    next();
};
