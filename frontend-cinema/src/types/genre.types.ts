import { TypeIconName } from '@/components/ui/Icon';

export interface IGenre {
	id: string;
	name: string;
	slug: string;
	description: string;
	icon: TypeIconName;
}

export type IGenreEditInput = Omit<IGenre, 'id'>;
