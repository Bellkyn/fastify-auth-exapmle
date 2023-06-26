import { FastifyInstance } from 'fastify';
import { RegisterSchema } from '../../shared/schemas/register_schema';
import { AuthController } from '../../controllers/auth_controller';
import { LoginSchema } from '../../shared/schemas/login_schema';
import { authPlugin } from '../../plugins/auth';

export const authRoutes = async (fastify: FastifyInstance): Promise<void> => {
	const authController = new AuthController();
	fastify.post(
		'/register',
		{
			schema: RegisterSchema
		},
		authController.register
	);

	fastify.post(
		'/login',
		{
			schema: LoginSchema
		},
		authController.login
	);

	//protected routes
	fastify.register(async instance => {
		instance.register(authPlugin);
		fastify.post('/checkAuth', authController.refresh);
		instance.post('/logout', authController.logout);
	});
};
