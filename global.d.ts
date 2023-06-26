import { Sequelize } from 'sequelize-typescript';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import {
	ContextConfigDefault,
	FastifyReply,
	FastifyRequest,
	FastifySchema,
	RawReplyDefaultExpression,
	RawRequestDefaultExpression,
	RawServerDefault,
	RouteGenericInterface
} from 'fastify';
import { TokenPayload } from './src/shared/types';

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			DB_HOST: string;
			NODE_ENV: 'development' | 'production';
			DB_PASSWORD: string;
			DB_NAME: string;
			JWT_ACCESS_SECRET: string;
			JWT_REFRESH_SECRET: string;
			COOKIE_SECRET: string;
		}
	}
}

declare module 'fastify' {
	export interface FastifyRequest {
		user?: TokenPayload;
	}
	interface FastifyInstance {
		pgSequelize: Sequelize;
	}
}

export type FastifyRequestTypebox<TSchema extends FastifySchema> =
	FastifyRequest<
		RouteGenericInterface,
		RawServerDefault,
		RawRequestDefaultExpression<RawServerDefault>,
		TSchema,
		TypeBoxTypeProvider
	>;

export type FastifyReplyTypebox<TSchema extends FastifySchema> = FastifyReply<
	RawServerDefault,
	RawRequestDefaultExpression,
	RawReplyDefaultExpression,
	RouteGenericInterface,
	ContextConfigDefault,
	TSchema,
	TypeBoxTypeProvider
>;
