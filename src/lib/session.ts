import { cookies } from 'next/headers';
import { signToken, verifyToken, type SessionPayload } from './auth';
import { env } from './env';

const SESSION_COOKIE_NAME = 'session';
const SESSION_DURATION = 60 * 60 * 24 * 30; // 30 days in seconds

const createSession = async ({
  userId,
  email,
  username,
}: {
  userId: string;
  email: string;
  username: string;
}): Promise<void> => {
  const token = await signToken({ userId, email, username });
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION,
    path: '/',
  });
};

const destroySession = async (): Promise<void> => {
  const cookieStore = await cookies();

  cookieStore.delete(SESSION_COOKIE_NAME);
};

const getUser = async (): Promise<SessionPayload | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  return verifyToken(token);
};

export { createSession, destroySession, getUser };
