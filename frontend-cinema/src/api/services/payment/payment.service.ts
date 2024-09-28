import { axiosClassic, axiosWithAuth } from '@/api/interceptors';

import { API_URL } from '@/config/api.config';

import { IPayment } from '@/types/payment.types';

type TypeData = {
	id: string;
	status: string;
	amount: string;
};

class PaymentService {
	async checkout(data: TypeData) {
		return axiosWithAuth.post(API_URL.payments(''), { data });
	}

	async getAll() {
		const { data } = await axiosClassic.get<IPayment[]>(API_URL.payments(''));

		return data;
	}

	async cancelPayment(paymentId: string) {
		return axiosWithAuth.post<IPayment[]>(API_URL.payments(`/cancel/${paymentId}`));
	}

	async delete(paymentId: string) {
		return axiosWithAuth.delete<IPayment[]>(API_URL.payments(`/${paymentId}`));
	}
}

export const paymentService = new PaymentService();
