import { FastifyRequest, FastifyInstance } from 'fastify';
import { TokenService } from '../services/token_service';
import { ApiError } from '../shared/utils';
import fastifyPlugin from 'fastify-plugin';

export const tokenVerify = async (request: FastifyRequest) => {
	const authHeader = request.headers.authorization;
	if (!authHeader) throw new ApiError(401, 'No auth token');

	const accessToken = authHeader.split(' ')[1];

	const tokenService = new TokenService();
	const decoded = tokenService.validateAccessToken(accessToken);
	if (!decoded) throw new ApiError(401, 'Error while decode token');
	request.user = decoded;
};

export const authPlugin = fastifyPlugin(async (fastify: FastifyInstance) => {
	fastify.decorateRequest('user', null);
	fastify.addHook('preHandler', tokenVerify);
});
