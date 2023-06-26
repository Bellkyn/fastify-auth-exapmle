import { FastifyRequest, FastifyReply } from 'fastify';
import { RegisterSchema } from '../shared/schemas/register_schema';
import { AuthService } from '../services/auth_service';
import { FastifyReplyTypebox, FastifyRequestTypebox } from '../../global';
import { LoginSchema } from '../shared/schemas/login_schema';
import { TokenService } from '../services/token_service';
import { RESFRESH_TOKEN_COOKIE } from '../shared/const';

class AuthController {
	register = async (
		request: FastifyRequestTypebox<typeof RegisterSchema>,
		reply: FastifyReplyTypebox<typeof RegisterSchema>
	) => {
		const { email, password, name } = request.body;
		const authService = new AuthService();

		const result = await authService.registerUser({
			email: email,
			password: password,
			name: name
		});

		reply.setCookie(RESFRESH_TOKEN_COOKIE, result.refreshToken, {
			maxAge: 30 * 24 * 60 * 60 * 1000,
			httpOnly: true
		});

		delete result[RESFRESH_TOKEN_COOKIE];

		reply.status(200).send({ ...result });
	};

	login = async (
		request: FastifyRequestTypebox<typeof LoginSchema>,
		reply: FastifyReplyTypebox<typeof LoginSchema>
	) => {
		const { email, password } = request.body;
		const authService = new AuthService();

		const result = await authService.login(email, password);

		reply.setCookie(RESFRESH_TOKEN_COOKIE, result.refreshToken, {
			maxAge: 30 * 24 * 60 * 60 * 1000,
			httpOnly: true
		});

		delete result[RESFRESH_TOKEN_COOKIE];

		reply.status(200).send({ ...result });
	};

	refresh = async (request: FastifyRequest, reply: FastifyReply) => {
		const refreshTokenCookie: string | null =
			request.cookies[RESFRESH_TOKEN_COOKIE];
		const authService = new AuthService();
		const result = await authService.refresh(refreshTokenCookie);

		reply.setCookie(RESFRESH_TOKEN_COOKIE, result.refreshToken, {
			maxAge: 30 * 24 * 60 * 60 * 1000,
			httpOnly: true
		});

		delete result[RESFRESH_TOKEN_COOKIE];

		reply.status(200).send({ ...result });
	};

	logout = async (request: FastifyRequest, reply: FastifyReply) => {
		const refreshTokenCookie: string | null =
			request.cookies[RESFRESH_TOKEN_COOKIE];
		if (!refreshTokenCookie) {
			reply.send(200);
		}
		const tokenService = new TokenService();
		await tokenService.deleteRefreshToken(refreshTokenCookie);
		reply.clearCookie(RESFRESH_TOKEN_COOKIE);
		reply.status(200).send('Succesfully logout');
	};
}
export { AuthController };
