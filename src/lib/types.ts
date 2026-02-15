import { z } from 'zod';

// Schema for a single match
const matchSchema = z.object({
  id: z.string().optional(),
  opponentArchetype: z.string().min(1, 'Opponent archetype is required').trim(),
  wins: z.number().min(0, 'Wins must be non-negative').int(),
  losses: z.number().min(0, 'Losses must be non-negative').int(),
});

// Schema for creating an event
const createEventSchema = z.object({
  eventName: z.string().min(1, 'Event name is required').trim(),
  eventDate: z.string().min(1, 'Event date is required'),
  notes: z.string().optional().default(''),
  matches: z
    .array(matchSchema)
    .min(1, 'At least one match is required')
    .refine(
      matches => matches.every(m => m.opponentArchetype.trim()),
      'All matches must have an opponent archetype',
    ),
});

// Schema for updating an event
const updateEventSchema = createEventSchema.extend({
  eventId: z.string().min(1, 'Event ID is required'),
});

// Exported types inferred from Zod schemas
export type MatchInput = z.infer<typeof matchSchema>;
export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;

// Helper type for event form data (event fields only, no matches)
export type EventFormData = Pick<
  CreateEventInput,
  'eventName' | 'eventDate' | 'notes'
>;

export { matchSchema, createEventSchema, updateEventSchema };
