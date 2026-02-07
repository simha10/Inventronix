export const authenticateAdmin = (req, res, next) => {
    const secret = req.headers['x-admin-secret'];

    if (!secret || secret !== process.env.ADMIN_SECRET_KEY) {
        return res.status(401).json({ error: 'Unauthorized: Invalid Admin Secret' });
    }

    next();
};
