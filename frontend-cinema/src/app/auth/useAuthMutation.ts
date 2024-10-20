import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { UseFormReset } from 'react-hook-form';
import toast from 'react-hot-toast';

import { authService } from '@/api/services/auth/auth.service';

import { DASHBOARD_URL } from '@/config/url.config';

import { IAuthForm } from '@/types/auth.types';

export const useAuthMutation = (isLoginForm: boolean, reset: UseFormReset<IAuthForm>) => {
	const { push, refresh } = useRouter();

	const { mutate } = useMutation({
		mutationKey: ['auth'],
		mutationFn: (data: IAuthForm) => authService.main(isLoginForm ? 'login' : 'register', data),
		onSuccess() {
			toast.success('Login successful!');
			reset();
			push(DASHBOARD_URL.root());
			refresh();
		},
		onError(error: any) {
			if (error.response && error.response.data && error.response.data.message) {
				toast.error(error.response.data.message);
			} else {
				toast.error('Error occurred!');
			}
		},
	});

	return { mutate };
};
