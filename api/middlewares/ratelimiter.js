import rateLimit from 'express-rate-limit';

export default rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  keyGenerator: (req) => req.headers['x-forwarded-for'] || req.ip,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many requests - please try again later',
      retryAfter: 15 * 60 // 15 minutes
    });
  }
});