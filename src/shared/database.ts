import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import { Sequelize } from 'sequelize-typescript';
import { User } from './models/User';
import { Token } from './models/Token';

const password = process.env.DB_PASSWORD;
const host = process.env.DB_HOST;
const database = process.env.DB_NAME;

const client = new Sequelize(database, 'postgres', password, {
	host: host,
	port: 5432,
	dialect: 'postgres'
});

client.addModels([User, Token]);
client.sync({ alter: true, logging: false });

const databasePlugin: FastifyPluginAsync = fastifyPlugin(
	async (fastify: FastifyInstance) => {
		try {
			await client.authenticate({}).then(() => {
				fastify.log.info('Database connected');
			});

			fastify.decorate('pgSequelize', client);

			fastify.addHook('onClose', async () => {
				await fastify.pgSequelize.close();
			});
		} catch (error) {
			throw new Error(`Error connect to database :${error}`);
		}
	}
);

export { databasePlugin, client as db };
