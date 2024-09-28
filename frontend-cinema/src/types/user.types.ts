import { IMovie } from '@/types/movie.types';

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
	favourites: IMovie[];
}

export type IUserEditInput = Pick<IUser, 'name' | 'email' | 'avatarPath' | 'role'>;
