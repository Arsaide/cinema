export enum UserRole {
	USER = 'USER',
	ADMIN = 'ADMIN',
}

export interface IUser {
	id: string;
	name: string;
	email: string;
	avatarPath: string;
	role: UserRole;
	isHasPremium: boolean;
	favourites: any[];
}

export interface IUserEditInput extends Pick<IUser, 'name' | 'email' | 'avatarPath' | 'role'> {}
