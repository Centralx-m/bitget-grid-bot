export default function authenticate(req, res, next) {
  // Skip auth for OPTIONS preflight
  if (req.method === 'OPTIONS') return next();
  
  const apiKey = req.headers['x-api-key'] || req.query.apiKey;
  
  if (!apiKey || apiKey !== process.env.API_AUTH_KEY) {
    res.setHeader('WWW-Authenticate', 'API-Key');
    return res.status(401).json({
      success: false,
      message: 'Invalid or missing API key',
      code: 'UNAUTHORIZED'
    });
  }
  
  next();
}