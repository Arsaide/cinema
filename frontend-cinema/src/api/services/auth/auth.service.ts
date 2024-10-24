import Cookies from 'js-cookie';

import { axiosClassic } from '@/api/interceptors';
import { EnumTokens, saveToStorage } from '@/api/services/auth/auth-token.service';

import { API_URL } from '@/config/api.config';

import { IAuthForm, IAuthResponse, IConfirmEmail } from '@/types/auth.types';

class AuthService {
	async main(type: 'login' | 'register', data: IAuthForm) {
		const response = await axiosClassic.post<IAuthResponse>(API_URL.auth(`/${type}`), data);

		if (response.data.accessToken) saveToStorage(response.data);

		return response;
	}

	async confirmEmail(token: string) {
		return await axiosClassic.get<IConfirmEmail>(API_URL.auth(`/confirm?token=${token}`));
	}

	async getNewTokens() {
		const refreshToken = Cookies.get(EnumTokens.REFRESH_TOKEN);

		const response = await axiosClassic.post<string, { data: IAuthResponse }>(
			API_URL.auth(`/login/access-token`),
			{ refreshToken },
		);

		if (response.data.accessToken) saveToStorage(response.data);

		return response;
	}
}

export const authService = new AuthService();
