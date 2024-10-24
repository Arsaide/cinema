'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

import { ConfirmEmailError } from '@/app/auth/confirm/confirm-error.types';
import { useConfirmQuery } from '@/app/auth/confirm/useConfirmQuery';

import Button from '@/components/ui/form-elements/button/Button';

import { PUBLIC_URL } from '@/config/url.config';

import styles from './Confirm.module.scss';

const Confirm = () => {
	const searchParams = useSearchParams();
	const router = useRouter();

	const confirmToken = searchParams.get('token') || '';

	const { data, isPending, error } = useConfirmQuery(confirmToken);

	const errorMessage = error as ConfirmEmailError;

	return (
		<div className={styles.wrapper}>
			<div className={styles.centeredBlock}>
				<h1 className={styles.title}>✉️ Confirmation email</h1>
				{isPending ? (
					'Email confirmation. This may take up to 1 minute'
				) : (
					<>
						{data ? (
							<p className={styles.message}>{data.message}</p>
						) : (
							error && (
								<>
									<div className={styles.message}>
										<span className={styles.error}>{errorMessage.message}: </span> <br />
										{errorMessage.response.data.message}
									</div>
									<Button
										onClick={() => router.push(PUBLIC_URL.auth())}
										className={styles.button}
									>
										Go back
									</Button>
								</>
							)
						)}
					</>
				)}
			</div>
		</div>
	);
};

export default Confirm;
