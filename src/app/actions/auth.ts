'use server';

import { redirect } from 'next/navigation';
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';
import { loginSchema } from '@/lib/types';
import { createSession, destroySession, getUser } from '@/lib/session';
import { logEvent } from '@/lib/log';

export type ActionResult = {
  success: boolean;
  error?: string;
};

const login = async (
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> => {
  try {
    const data = {
      usernameOrEmail: formData.get('usernameOrEmail') as string,
      password: formData.get('password') as string,
    };

    // Validate with Zod
    const result = loginSchema.safeParse(data);

    if (!result.success) {
      const firstError = result.error.issues[0];

      return {
        success: false,
        error: firstError.message,
      };
    }

    // Find user by username
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          {
            username: {
              equals: result.data.usernameOrEmail,
              mode: 'insensitive',
            },
          },
          {
            email: { equals: result.data.usernameOrEmail, mode: 'insensitive' },
          },
        ],
      },
    });

    if (!user) {
      // The attempted username/email is deliberately not logged
      logEvent('auth.loginFailed', { reason: 'unknownUser' });

      return {
        success: false,
        error: 'Invalid username/email or password',
      };
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      result.data.password,
      user.password,
    );

    if (!isPasswordValid) {
      logEvent('auth.loginFailed', {
        reason: 'badPassword',
        userId: user.id,
      });

      return {
        success: false,
        error: 'Invalid username or password',
      };
    }

    // Create session
    await createSession({
      userId: user.id,
      email: user.email,
      username: user.username,
    });

    logEvent('auth.login', { userId: user.id });
  } catch (error) {
    console.error('Error during login:', error);

    return {
      success: false,
      error: 'Failed to log in',
    };
  }

  redirect('/');
};

const logout = async (): Promise<void> => {
  const user = await getUser();

  await destroySession();

  logEvent('auth.logout', { userId: user?.userId ?? null });
  redirect('/login');
};

export { login, logout };
