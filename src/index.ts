import { Elysia, t } from 'elysia';
import { executeCode } from './daytona-service';
import { env } from './env';

const app = new Elysia()
	.onError(({ code, error, set }) => {
		//
		if (code === 'VALIDATION') {
			set.status = 400;
			set.headers['content-type'] = 'text/plain';
			return 'Invalid request: Please provide valid "code" (string) and "language" ("typescript" or "python") parameters';
		}

		set.status = 500;
		set.headers['content-type'] = 'text/plain';
		return error instanceof Error ? error.message : 'Unknown error occurred';
	})
	.use(authMiddleware)
	.get('/', () => ({
		message: 'Daytona Code Execution API',
		version: '1.0.0',
		endpoints: {
			'/execute': 'POST - Execute TypeScript or Python code in Daytona sandbox',
		},
	}))
	.post(
		'/execute',
		async ({ body, set }) => {
			//
			const { code, language } = body;
			const result = await executeCode(code, language);

			set.headers['content-type'] = 'text/plain';
			return result;
		},
		{
			body: t.Object({
				code: t.String({
					description: 'The code to execute in the sandbox',
				}),
				language: t.Union(
					[
						t.Literal('typescript'), //
						t.Literal('python'),
					],
					{ description: 'The programming language to execute (typescript or python)' },
				),
			}),
			response: {
				200: t.String({ description: 'Execution result' }),
				400: t.String({ description: 'Bad request error' }),
				500: t.String({ description: 'Server error' }),
			},
		},
	);

function authMiddleware(app: Elysia) {
	//
	return app.derive(({ headers, set }) => {
		//
		const apiKey = headers['x-api-key'] || headers['authorization']?.replace('Bearer ', '');

		if (!apiKey || apiKey !== env.API_KEY) {
			set.status = 401;
			set.headers['content-type'] = 'text/plain';
			throw new Error('Unauthorized');
		}

		return {};
	});
}

console.info(`🦊 Elysia is running at http://localhost:${env.PORT}`);

export default app;
