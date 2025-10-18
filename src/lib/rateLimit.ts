interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

export interface RateLimitConfig {
  interval: number; // in milliseconds
  maxAttempts: number;
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetTime: Date;
}

/**
 * Rate limiting utility
 */
export function rateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const record = store[identifier];

  // If no record or expired, create new
  if (!record || now > record.resetTime) {
    store[identifier] = {
      count: 1,
      resetTime: now + config.interval,
    };

    return {
      success: true,
      remaining: config.maxAttempts - 1,
      resetTime: new Date(now + config.interval),
    };
  }

  // Check if limit exceeded
  if (record.count >= config.maxAttempts) {
    return {
      success: false,
      remaining: 0,
      resetTime: new Date(record.resetTime),
    };
  }

  // Increment count
  record.count++;

  return {
    success: true,
    remaining: config.maxAttempts - record.count,
    resetTime: new Date(record.resetTime),
  };
}

/**
 * Get rate limit for login attempts
 */
export function rateLimitLogin(identifier: string): RateLimitResult {
  const maxAttempts = parseInt(
    process.env.RATE_LIMIT_LOGIN_ATTEMPTS || '5'
  );
  const window = parseInt(process.env.RATE_LIMIT_LOGIN_WINDOW || '3600');

  return rateLimit(identifier, {
    maxAttempts,
    interval: window * 1000,
  });
}

/**
 * Get rate limit for contact form
 */
export function rateLimitContact(identifier: string): RateLimitResult {
  const maxAttempts = parseInt(
    process.env.RATE_LIMIT_CONTACT_SUBMISSIONS || '10'
  );
  const window = parseInt(process.env.RATE_LIMIT_CONTACT_WINDOW || '3600');

  return rateLimit(identifier, {
    maxAttempts,
    interval: window * 1000,
  });
}

/**
 * Get rate limit for API calls
 */
export function rateLimitAPI(identifier: string): RateLimitResult {
  const maxAttempts = parseInt(process.env.RATE_LIMIT_API_CALLS || '100');
  const window = parseInt(process.env.RATE_LIMIT_API_WINDOW || '3600');

  return rateLimit(identifier, {
    maxAttempts,
    interval: window * 1000,
  });
}

/**
 * Reset rate limit for identifier
 */
export function resetRateLimit(identifier: string): void {
  delete store[identifier];
}

