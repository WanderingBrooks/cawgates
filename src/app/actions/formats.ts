'use server';

import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/session';
import { logEvent } from '@/lib/log';
import { createFormatSchema, type ActionResultWithData } from '@/lib/types';

const getUserFormats = async () => {
  const user = await getUser();

  if (!user) {
    return [];
  }

  return prisma.format.findMany({
    where: { userId: user.userId },
    orderBy: { name: 'asc' },
  });
};

const createFormat = async (
  _prevState: ActionResultWithData<{ id: string; name: string }> | null,
  formData: FormData,
): Promise<ActionResultWithData<{ id: string; name: string }>> => {
  const user = await getUser();

  if (!user) {
    return { success: false, error: 'You must be logged in' };
  }

  const name = formData.get('name') as string;

  const result = createFormatSchema.safeParse({ name });

  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  try {
    const created = await prisma.format.create({
      data: {
        name: result.data.name,
        userId: user.userId,
      },
    });

    logEvent('format.created', {
      userId: user.userId,
      formatId: created.id,
    });

    return {
      success: true,
      data: { id: created.id, name: created.name },
    };
  } catch (error: unknown) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: string }).code === 'P2002'
    ) {
      return {
        success: false,
        error: 'A format with that name already exists',
      };
    }

    throw error;
  }
};

const updateFormat = async (
  _prevState: ActionResultWithData<{ id: string; name: string }> | null,
  formData: FormData,
): Promise<ActionResultWithData<{ id: string; name: string }>> => {
  const user = await getUser();

  if (!user) {
    return { success: false, error: 'You must be logged in' };
  }

  const formatId = formData.get('formatId') as string;
  const name = formData.get('name') as string;

  const result = createFormatSchema.safeParse({ name });

  if (!result.success) {
    return { success: false, error: result.error.issues[0].message };
  }

  const format = await prisma.format.findUnique({
    where: { id: formatId },
  });

  if (!format || format.userId !== user.userId) {
    return { success: false, error: 'Format not found' };
  }

  try {
    const updated = await prisma.format.update({
      where: { id: formatId },
      data: { name: result.data.name },
    });

    logEvent('format.updated', {
      userId: user.userId,
      formatId: updated.id,
    });

    return {
      success: true,
      data: { id: updated.id, name: updated.name },
    };
  } catch (error: unknown) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: string }).code === 'P2002'
    ) {
      return {
        success: false,
        error: 'A format with that name already exists',
      };
    }

    throw error;
  }
};

export { getUserFormats, createFormat, updateFormat };
