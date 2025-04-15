export default function securityHeaders(req, res, next) {
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'", // Remove unsafe-inline for production
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "form-action 'self'"
  ].join('; ');

  res.setHeader('Content-Security-Policy', csp);
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Feature-Policy', "geolocation 'none'; microphone 'none'; camera 'none'");
  
  next();
}