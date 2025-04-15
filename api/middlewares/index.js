import authenticate from './authentication';
import rateLimiter from './rateLimiter';
import securityHeaders from './securityHeaders';
import sslEnforcer from './sslEnforcer';
import validator from './validator';

export default function applyMiddlewares(handler) {
  return async (req, res) => {
    try {
      // Apply security middlewares in sequence
      await sslEnforcer(req, res);
      await securityHeaders(req, res);
      await authenticate(req, res);
      await rateLimiter(req, res);
      
      // Only proceed if no middleware has sent a response
      if (!res.writableEnded) {
        return await handler(req, res);
      }
    } catch (error) {
      console.error('Security middleware error:', error);
      return res.status(500).json({
        success: false,
        message: 'Security check failed',
        error: error.message
      });
    }
  };
}