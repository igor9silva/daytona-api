import { Daytona } from '@daytonaio/sdk';
import { Sandbox } from '@daytonaio/sdk/src/Sandbox';
import { env } from './env';

export async function executeCode(
	code: string, //
	language: 'typescript' | 'python',
) {
	//
	let sandbox: Sandbox | null = null;

	try {
		//
		const daytona = new Daytona({ apiKey: env.DAYTONA_API_KEY });

		// from seconds to minutes for autoStopInterval
		const autoStopMinutes = Math.ceil(env.EXECUTION_TIMEOUT_SECONDS / 60);

		sandbox = await daytona.create({
			language: language,
			autoStopInterval: autoStopMinutes, // use auto-stop as our timeout mechanism
		});

		const response = await sandbox.process.codeRun(code);

		return response.result;
		//
	} catch (error) {
		//
		console.error('Daytona execution error:', error);
		throw error;
		//
	} finally {
		//
		// clean up
		if (sandbox) {
			try {
				await sandbox.delete();
			} catch (cleanupError) {
				console.error('Error cleaning up sandbox:', cleanupError);
			}
		}
	}
}
