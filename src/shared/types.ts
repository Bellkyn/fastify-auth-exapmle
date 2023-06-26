export interface IRegisterData {
	name: string;
	password: string;
	email: string;
}
export interface ILoginData {
	password: string;
	email: string;
}

export type TokenPayload = {
	id: string;
	name: string;
};
