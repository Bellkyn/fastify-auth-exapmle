import jwt from 'jsonwebtoken';
import { TokenPayload } from '../shared/types';
import { Token } from '../shared/models/Token';
import { ApiError } from '../shared/utils';

const jwtAccesSecret = process.env.JWT_ACCESS_SECRET;
const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;

class TokenService {
	generateTokens = (
		payload: TokenPayload
	): { accessToken: string; refreshToken: string } => {
		const accessToken = jwt.sign(payload, jwtAccesSecret, { expiresIn: '12h' });
		const refreshToken = jwt.sign(payload, jwtRefreshSecret, {
			expiresIn: '30d'
		});

		return { accessToken, refreshToken };
	};

	saveToken = async (userId: string, refreshToken: string): Promise<void> => {
		const candidate: Token | null = await Token.findOne({
			where: { userId: userId }
		});
		if (candidate) {
			await candidate.update({ refreshToken: refreshToken });
		} else {
			await Token.create({ refreshToken: refreshToken, userId: userId });
		}
	};

	validateAccessToken = (token: string): TokenPayload | null => {
		try {
			const userData = jwt.verify(
				token,
				process.env.JWT_ACCESS_SECRET
			) as TokenPayload;
			return userData;
		} catch (error) {
			return null;
		}
	};

	validateRefreshToken = (token: string): TokenPayload | null => {
		try {
			const userData = jwt.verify(
				token,
				process.env.JWT_REFRESH_SECRET
			) as TokenPayload;
			return userData;
		} catch (error) {
			return null;
		}
	};

	findRefrehToken = async (token: string): Promise<string> => {
		const tokenDb: Token = await Token.findOne({
			where: { refreshToken: token }
		});
		if (!token) throw new ApiError(404, 'Refresh token doesnt exists');

		return tokenDb.refreshToken;
	};

	deleteRefreshToken = async (refreshToken: string) => {
		return await Token.destroy({ where: { refreshToken: refreshToken } });
	};
}

export { TokenService };
