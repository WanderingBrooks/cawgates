import 'dotenv/config';

import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.url(),
});

// This file is responsible for validating and exporting environment variables.
// It uses Zod to define a schema for the expected environment variables and
// validates them at runtime. If the validation fails, it logs the errors and
// throws an exception to prevent the application from running with invalid
// configuration.
// eslint-disable-next-line no-restricted-properties
const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('Invalid environment variables:', z.treeifyError(_env.error));

  throw new Error('Environment validation failed');
}

const env = _env.data;

export { env };
