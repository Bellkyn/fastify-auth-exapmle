import { hash, compare } from 'bcrypt';
import { User } from '../shared/models/User';
import { IRegisterData } from '../shared/types';
import { TokenService } from './token_service';
import { ApiError } from '../shared/utils';

type promiseResult = { id: string; accessToken: string; refreshToken: string };

class AuthService {
	registerUser = async (data: IRegisterData): Promise<promiseResult> => {
		const candidate: User | null = await User.findOne({
			where: {
				email: data.email
			}
		});
		if (candidate !== null)
			throw new ApiError(403, 'User with same email already exist');

		const hashedPass = await hash(data.password, 8);
		const user = User.build({
			email: data.email,
			password: hashedPass,
			name: data.name
		});
		const tokenService = new TokenService();

		const { accessToken, refreshToken } = tokenService.generateTokens({
			id: user.id,
			name: user.name
		});

		await tokenService.saveToken(user.id, refreshToken);
		await user.save();

		return { id: user.id, accessToken, refreshToken };
	};

	login = async (email: string, password: string): Promise<promiseResult> => {
		const user: User | null = await User.findOne({ where: { email: email } });
		if (!user) throw new ApiError(404, 'User doesnt exists');

		const isEqualPass = await compare(password, user.password);
		if (!isEqualPass) throw new ApiError(401, 'Password doesnt match');

		const tokenService = new TokenService();

		const { accessToken, refreshToken } = tokenService.generateTokens({
			id: user.id,
			name: user.name
		});

		await tokenService.saveToken(user.id, refreshToken);

		return { id: user.id, accessToken, refreshToken };
	};

	refresh = async (refreshToken: string | null): Promise<promiseResult> => {
		if (!refreshToken) throw new ApiError(401, 'No refresh token');

		const tokenService = new TokenService();
		const tokenFromDB = await tokenService.findRefrehToken(refreshToken);

		if (tokenFromDB !== refreshToken)
			throw new ApiError(401, 'Resfresh token doesnt match');

		const userInfo = tokenService.validateRefreshToken(refreshToken);
		
		if (!userInfo) throw new ApiError(401, 'Error while validate token');

		const newUserInfo: User | null = await User.findOne({
			where: { id: userInfo.id }
		});

		if (!userInfo) throw new ApiError(404, 'User not found');

		const newTokens = tokenService.generateTokens({
			id: newUserInfo.id,
			name: newUserInfo.name
		});

		await tokenService.saveToken(newUserInfo.id, newTokens.refreshToken);

		return { ...newTokens, id: newUserInfo.id };
	};

	logout = async (refreshToken: string) => {
		const tokenService = new TokenService();
		await tokenService.deleteRefreshToken(refreshToken);
	};
}

export { AuthService };
