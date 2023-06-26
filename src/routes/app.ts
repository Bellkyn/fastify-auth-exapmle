import fastify, { FastifyInstance, FastifyServerOptions } from 'fastify';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';

import { authRoutes } from './auth/auth_routes';
import swagger from '../plugins/swagger';
import { databasePlugin } from '../shared/database';
import fastifyCookie from '@fastify/cookie';

const buildFastifyApp = async (opts: Partial<FastifyServerOptions> = {}) => {
	const app: FastifyInstance =
		fastify(opts).withTypeProvider<TypeBoxTypeProvider>();
	//register routes and etc here

	app.register(fastifyCookie, {
		secret: process.env.COOKIE_SECRET
	});

	app.register(swagger);
	app.register(databasePlugin);
	app.register(authRoutes, { prefix: '/api/auth' });

	return app;
};

export default buildFastifyApp;
