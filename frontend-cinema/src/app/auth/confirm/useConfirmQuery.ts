import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import { authService } from '@/api/services/auth/auth.service';

import { PUBLIC_URL } from '@/config/url.config';

export const useConfirmQuery = (token: string) => {
	const { push, refresh } = useRouter();

	const { data, isSuccess, error, isPending } = useQuery({
		queryKey: ['confirm-email'],
		queryFn: () => authService.confirmEmail(token),
		select: data => data.data,
	});

	if (isSuccess) {
		toast.success('Confirm email successful! You can now log-in!');
		push(PUBLIC_URL.auth());
		refresh();
	}

	return { data, isPending, error };
};
