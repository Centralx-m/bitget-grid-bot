import db from './lib/db';

export async function logSecurityEvent(userId, eventType, metadata = {}) {
  try {
    await db.logSecurityEvent(userId, {
      event_type: eventType,
      ip_address: metadata.ip || 'unknown',
      user_agent: metadata.userAgent || 'unknown',
      metadata: JSON.stringify(metadata)
    });
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
}

export function detectSuspiciousActivity(req) {
  // Implement basic anomaly detection
  const anomalies = [];
  
  if (req.headers['user-agent'] === '') {
    anomalies.push('empty_user_agent');
  }
  
  if (req.headers['accept-language'] === '') {
    anomalies.push('empty_language_header');
  }
  
  if (anomalies.length > 0) {
    logSecurityEvent(req.headers['x-user-id'], 'suspicious_activity', {
      anomalies,
      headers: req.headers
    });
    return true;
  }
  
  return false;
}