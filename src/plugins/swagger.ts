import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { FastifyInstance } from 'fastify';
import { fastifyPlugin } from 'fastify-plugin';

const swagger = fastifyPlugin(async function (
	fastify: FastifyInstance
): Promise<void> {
	await fastify.register(fastifySwagger, {
		swagger: {
			info: {
				title: 'sedya-service-server',
				description: 'test swagger-fastify',
				version: '0.1'
			},
			host: 'localhost:3000',
			schemes: ['http'],
			consumes: ['application/json'],
			produces: ['application/json']
		}
	});

	await fastify.register(fastifySwaggerUi, {
		routePrefix: '/swagger',
		uiConfig: {
			docExpansion: 'full',
			deepLinking: false
		},
		staticCSP: true,
		transformSpecificationClone: true
	});

	fastify.log.info('swagger connected');
});

export default swagger;
