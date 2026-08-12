import 'dotenv/config';

import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.url(),
  NODE_ENV: z.enum(['development', 'production', 'test']),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
});

// This file is responsible for validating and exporting environment variables.
// It uses Zod to define a schema for the expected environment variables and
// validates them at runtime. If the validation fails, it logs the errors and
// throws an exception to prevent the application from running with invalid
// configuration.
//
// SKIP_ENV_VALIDATION bypasses this for contexts that load app code without
// real secrets available — Docker image builds and `prisma generate` (which
// builds the client from the schema and never connects to a database). Real
// deployments never set this, so the fail-fast check still applies wherever
// it actually matters.
let env: z.infer<typeof envSchema>;

// eslint-disable-next-line no-restricted-properties
if (process.env.SKIP_ENV_VALIDATION) {
  // eslint-disable-next-line no-restricted-properties
  env = process.env as unknown as z.infer<typeof envSchema>;
} else {
  // eslint-disable-next-line no-restricted-properties
  const _env = envSchema.safeParse(process.env);

  if (!_env.success) {
    console.error(
      'Invalid environment variables:',
      JSON.stringify(z.treeifyError(_env.error), null, 2),
    );

    throw new Error('Environment validation failed');
  }

  env = _env.data;
}

export { env };
