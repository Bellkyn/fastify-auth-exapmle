import { Type } from '@sinclair/typebox';

export const LoginSchema = {
	tags: ['Authentication'],
	body: Type.Required(
		Type.Object({
			email: Type.String({ format: 'email' }),
			password: Type.String()
		})
	),
	response: {
		201: Type.Object({
			id: Type.String(),
			accessToken: Type.String()
		})
	}
};
