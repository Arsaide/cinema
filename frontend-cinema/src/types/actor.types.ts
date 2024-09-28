export interface IActor {
	id: string;
	name: string;
	slug: string;
	photoUrl: string;
	movies: any[];
}

export interface IActorEditInput extends Omit<IActor, 'id' | 'movies'> {}
