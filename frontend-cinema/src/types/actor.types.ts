import { IMovie } from '@/types/movie.types';

export interface IActor {
	id: string;
	name: string;
	slug: string;
	photoUrl: string;
	movies: IMovie[];
}

export type IActorEditInput = Omit<IActor, 'id' | 'movies'>;
