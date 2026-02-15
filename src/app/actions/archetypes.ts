'use server';

import { prisma } from '@/lib/prisma';

const getOpponentArchetypes = async (): Promise<string[]> => {
  try {
    const matches = await prisma.match.findMany({
      select: {
        opponentArchetype: true,
      },
      distinct: ['opponentArchetype'],
      orderBy: {
        opponentArchetype: 'asc',
      },
    });

    return matches.map(match => match.opponentArchetype);
  } catch (error) {
    console.error('Failed to fetch archetypes:', error);

    return [];
  }
};

export { getOpponentArchetypes };
