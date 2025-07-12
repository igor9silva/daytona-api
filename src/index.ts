import { Elysia, t } from 'elysia';
import { executeCode } from './daytona-service';
import { env } from './env';

const app = new Elysia()
	.use(authMiddleware)
	.get('/', () => ({
		message: 'Daytona Code Execution API',
		version: '1.0.0',
		endpoints: {
			'/execute/typescript': 'POST - Execute TypeScript code in Daytona sandbox',
			'/execute/python': 'POST - Execute Python code in Daytona sandbox',
		},
	}))
	.use(createExecuteEndpoint('typescript'))
	.use(createExecuteEndpoint('python'));

function createExecuteEndpoint(language: 'typescript' | 'python') {
	//
	return new Elysia().post(
		`/execute/${language}`,
		async ({ body, set }) => {
			//
			try {
				//
				const { code } = body as { code: string };

				if (!code || typeof code !== 'string') {
					set.status = 400;
					return 'Code parameter is required and must be a string';
				}

				const result = await executeCode(code, language);

				set.headers['content-type'] = 'text/plain';
				return result;
				//
			} catch (error) {
				//
				console.error(`${language} execution error:`, error);

				set.status = 500;
				set.headers['content-type'] = 'text/plain';
				return error instanceof Error ? error.message : 'Unknown error occurred';
			}
		},
		{
			body: t.Object({
				code: t.String({ description: `The ${language} code to execute in the sandbox` }),
			}),
			response: {
				200: t.String({ description: 'Execution result' }),
				400: t.String({ description: 'Bad request error' }),
				500: t.String({ description: 'Server error' }),
			},
		},
	);
}

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
