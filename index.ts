import dotenv from 'dotenv';
import path from 'path';
import { FastifyInstance } from 'fastify';

dotenv.config({
	path: path.join(__dirname, `.env.${process.env.NODE_ENV}`),
	debug: true
});

import buildFastifyApp from './src/routes/app';
import { envToLogger } from './src/shared/utils';

const port = 3100;

const start = async () => {
	const app: FastifyInstance = await buildFastifyApp({
		logger: envToLogger[process.env.NODE_ENV]
	});
	try {
		await app.ready();
		await app.listen({ port: port });
		app.swagger();
	} catch (err) {
		app.log.fatal(err);
		process.exit(1);
	}
};

start();
