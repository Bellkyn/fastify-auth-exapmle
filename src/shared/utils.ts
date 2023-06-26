import { PinoLoggerOptions } from 'fastify/types/logger';

interface IEnvToLogger {
	[index: string]: PinoLoggerOptions | boolean;
}

export const envToLogger: IEnvToLogger = {
	development: {
		transport: {
			target: 'pino-pretty',
			options: {
				translateTime: 'HH:MM:ss Z',
				ignore: 'pid,hostname'
			}
		}
	},
	production: true,
	test: false
};

export class ApiError extends Error {
	statusCode: number;

	constructor(statusCode: number, message: string) {
		super(message);
		this.statusCode = statusCode;

		Error.captureStackTrace(this, this.constructor);
	}
}
