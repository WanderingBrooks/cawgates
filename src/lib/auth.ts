import { SignJWT, jwtVerify } from 'jose';
import { env } from './env';

export type SessionPayload = {
  userId: string;
  email: string;
  username: string;
  exp: number;
  iat: number;
};

const SECRET_KEY = new TextEncoder().encode(env.JWT_SECRET);
const ALGORITHM = 'HS256';

const signToken = async (payload: {
  userId: string;
  email: string;
  username: string;
}): Promise<string> => {
  const now = Math.floor(Date.now() / 1000);
  const expiresIn = 60 * 60 * 24 * 30; // 30 days in seconds

  return new SignJWT({
    userId: payload.userId,
    email: payload.email,
    username: payload.username,
  })
    .setProtectedHeader({ alg: ALGORITHM })
    .setIssuedAt(now)
    .setExpirationTime(now + expiresIn)
    .sign(SECRET_KEY);
};

const verifyToken = async (token: string): Promise<SessionPayload | null> => {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY, {
      algorithms: [ALGORITHM],
    });

    return payload as SessionPayload;
  } catch (error) {
    console.error('Token verification failed:', error);

    return null;
  }
};

export { signToken, verifyToken };
