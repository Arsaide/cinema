import { axiosClassic, axiosWithAuth } from '@/api/interceptors';

import { API_URL } from '@/config/api.config';

import { IReview } from '@/types/review.types';

type TypeData = {
	rating: number;
	text: string;
};

class ReviewService {
	async getAll() {
		const { data } = await axiosClassic.get<IReview[]>(API_URL.reviews(''));

		return data;
	}

	async create(movieId: string, data: TypeData) {
		return axiosWithAuth.post<IReview[]>(API_URL.reviews(`/create/${movieId}`), data);
	}

	async delete(id: string) {
		return axiosWithAuth.delete<string>(API_URL.reviews(`/${id}`));
	}
}

export const reviewService = new ReviewService();
