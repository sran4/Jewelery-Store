import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '30d';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  rememberMe?: boolean;
}

/**
 * Generate JWT token
 */
export function generateToken(
  payload: JWTPayload,
  expiresIn?: string
): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: expiresIn || JWT_EXPIRES_IN,
  } as jwt.SignOptions);
}

/**
 * Verify JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Decode token without verification (for debugging)
 */
export function decodeToken(token: string): JWTPayload | null {
  try {
    return jwt.decode(token) as JWTPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Generate token with custom expiry based on "remember me"
 */
export function generateAuthToken(
  payload: JWTPayload,
  rememberMe: boolean = false
): string {
  const expiresIn = rememberMe ? '30d' : '24h';
  return generateToken({ ...payload, rememberMe }, expiresIn);
}

