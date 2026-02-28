'use server';

import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { registerUserSchema } from '@/lib/types';
import { createSession } from '@/lib/session';
import bcrypt from 'bcrypt';

export type ActionResult = {
  success: boolean;
  error?: string;
};

const SALT_ROUNDS = 10;

const registerUser = async (
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> => {
  try {
    const data = {
      email: formData.get('email') as string,
      username: formData.get('username') as string,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
    };

    // Validate with Zod
    const result = registerUserSchema.safeParse(data);

    if (!result.success) {
      const firstError = result.error.issues[0];

      return {
        success: false,
        error: firstError.message,
      };
    }

    // Check if email or username already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: result.data.email }, { username: result.data.username }],
      },
    });

    if (existingUser) {
      if (existingUser.email === result.data.email) {
        return {
          success: false,
          error:
            'An account with that email already exists. Please log in instead.',
        };
      }

      if (existingUser.username === result.data.username) {
        return {
          success: false,
          error:
            'An account with that username already exists. Please choose a different username.',
        };
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(result.data.password, SALT_ROUNDS);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: result.data.email,
        username: result.data.username,
        password: hashedPassword,
      },
    });

    // Create session to auto-login user
    await createSession({
      userId: user.id,
      email: user.email,
      username: user.username,
    });
  } catch (error) {
    console.error('Error registering user:', error);

    return {
      success: false,
      error: 'Failed to register user',
    };
  }

  redirect('/');
};

export { registerUser };
