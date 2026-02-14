const rateLimitMap = new Map();

// Clean up every minute
setInterval(() => {
    const now = Date.now();
    for (const [ip, data] of rateLimitMap.entries()) {
        if (now - data.windowStart > 60000) { // 1 minute window
            rateLimitMap.delete(ip);
        }
    }
}, 60000);

export const rateLimiter = (options = {}) => {
    const windowMs = options.windowMs || 60000; // Default 1 minute
    const max = options.max || 100; // Default 100 requests per window
    const message = options.message || 'Too many requests, please try again later.';

    return (req, res, next) => {
        const ip = req.ip || req.connection.remoteAddress;
        const now = Date.now();

        if (!rateLimitMap.has(ip)) {
            rateLimitMap.set(ip, { count: 1, windowStart: now });
            return next();
        }

        const data = rateLimitMap.get(ip);

        if (now - data.windowStart > windowMs) {
            // Reset window
            data.count = 1;
            data.windowStart = now;
            return next();
        }

        if (data.count >= max) {
            return res.status(429).json({ success: false, error: message });
        }

        data.count++;
        next();
    };
};
