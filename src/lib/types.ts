import { z } from 'zod';
import { RESERVED_SLUGS } from './utils';

// Schema for a single match
const matchSchema = z.object({
  id: z.string().optional(),
  opponentArchetypeId: z
    .string()
    .min(1, 'Opponent archetype is required')
    .trim(),
  wins: z.number().min(0, 'Wins must be non-negative').int(),
  losses: z.number().min(0, 'Losses must be non-negative').int(),
});

// Schema for creating an event
const createEventSchema = z.object({
  deckId: z.string().min(1, 'Deck ID is required'),
  eventName: z.string().min(1, 'Event name is required').trim(),
  eventDate: z.string().min(1, 'Event date is required'),
  notes: z.string().optional().default(''),
});

// Schema for updating an event
const updateEventSchema = createEventSchema.extend({
  eventId: z.string().min(1, 'Event ID is required'),
});

// Schema for creating a match
const createMatchSchema = z.object({
  eventId: z.string().min(1, 'Event ID is required'),
  opponentArchetypeId: z
    .string()
    .min(1, 'Opponent archetype is required')
    .trim(),
  wins: z.number().min(0, 'Wins must be non-negative').int(),
  losses: z.number().min(0, 'Losses must be non-negative').int(),
  notes: z.string().optional().default(''),
});

// Schema for updating a match
const updateMatchSchema = createMatchSchema.extend({
  matchId: z.string().min(1, 'Match ID is required'),
});

// Exported types inferred from Zod schemas
export type MatchInput = z.infer<typeof matchSchema>;
export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
export type CreateMatchInput = z.infer<typeof createMatchSchema>;
export type UpdateMatchInput = z.infer<typeof updateMatchSchema>;

// Form state type that allows empty strings for wins/losses during input
export type MatchInputForm = Omit<MatchInput, 'wins' | 'losses'> & {
  wins: number | '';
  losses: number | '';
  notes?: string;
};

// Schema for creating/updating an opponent archetype
const createOpponentArchetypeSchema = z.object({
  name: z.string().min(1, 'Name is required').trim(),
});

export type CreateOpponentArchetypeInput = z.infer<
  typeof createOpponentArchetypeSchema
>;

/**
 * Return type of server actions that return success or failure.
 * Use ActionResultWithData<T> when the success case includes data.
 */
export type ActionResult =
  | { success: true; error?: never }
  | { success: false; error: string };

export type ActionResultWithData<T> =
  | { success: true; data: T; error?: never }
  | { success: false; error: string };

// Helper type for event form data (event fields only, no matches)
export type EventFormData = Pick<
  CreateEventInput,
  'deckId' | 'eventName' | 'eventDate' | 'notes'
>;

const slugSchema = z
  .string()
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    'May only contain lowercase letters, numbers, and hyphens',
  )
  .trim()
  .refine(
    slug => !RESERVED_SLUGS.includes(slug),
    'This value is reserved and cannot be used',
  );

// Schema for creating a deck
const createDeckSchema = z.object({
  name: z.string().min(1, 'Deck name is required').trim(),
  isPublic: z
    .literal('on')
    .optional()
    .nullable()
    .transform(value => value === 'on'),
  slug: slugSchema
    .min(1, 'Slug is required')
    .max(100, 'Slug must be 100 characters or less'),
});

// Exported type inferred from Zod schema
export type CreateDeckInput = z.infer<typeof createDeckSchema>;

// Schema for user registration
const registerUserSchema = z
  .object({
    email: z.email('Invalid email address').trim().toLowerCase(),
    username: slugSchema.min(3, 'Username must be at least 3 characters'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// Schema for user login
const loginSchema = z.object({
  usernameOrEmail: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, 'Username or Email are required'),
  password: z.string().min(1, 'Password is required'),
});

// Exported types inferred from Zod schemas
export type RegisterUserInput = z.infer<typeof registerUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

export {
  matchSchema,
  createEventSchema,
  updateEventSchema,
  createMatchSchema,
  updateMatchSchema,
  createDeckSchema,
  createOpponentArchetypeSchema,
  registerUserSchema,
  loginSchema,
};
