import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
	//
	runtimeEnv: process.env,

	server: {
		//
		PORT: z.coerce.number().default(4000).describe('Server port.'),
		DAYTONA_API_KEY: z.string().min(1).describe('Daytona API key.'),
		EXECUTION_TIMEOUT_SECONDS: z.coerce.number().default(60).describe('Code execution timeout in seconds.'),
	},

	/**
	 * By default, this library will feed the environment variables directly to
	 * the Zod validator.
	 *
	 * This means that if you have an empty string for a value that is supposed
	 * to be a number (e.g. `PORT=` in a ".env" file), Zod will incorrectly flag
	 * it as a type mismatch violation. Additionally, if you have an empty string
	 * for a value that is supposed to be a string with a default value (e.g.
	 * `DOMAIN=` in an ".env" file), the default value will never be applied.
	 *
	 * This is true in order to solve these issues.
	 */
	emptyStringAsUndefined: true,
});
