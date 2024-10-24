'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import AuthFields from '@/app/auth/AuthFields';
import { useAuthMutation } from '@/app/auth/useAuthMutation';

import Button from '@/components/ui/form-elements/button/Button';
import Heading from '@/components/ui/heading/Heading';

import { IAuthForm } from '@/types/auth.types';

import styles from './Auth.module.scss';

const Auth = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<IAuthForm>({
		mode: 'onChange',
	});

	const [isLoginForm, setIsLoginForm] = useState<boolean>(true);

	const { mutate, isPending } = useAuthMutation(isLoginForm, reset);

	const onSubmit: SubmitHandler<IAuthForm> = data => {
		mutate(data);
	};

	return (
		<div className={styles.wrapper}>
			<div className={styles.left}>
				<Heading className={styles.heading}>
					{isLoginForm ? '👋 Sign in' : '🚀 Registration'}
				</Heading>
				<form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
					<AuthFields register={register} errors={errors} isLoginForm={isLoginForm} />
					{!isLoginForm && (
						<p className={styles.hint}>*Check your email after successful registration!</p>
					)}
					<Button disabled={isPending} className={styles.button}>
						{isPending ? 'Please wait...' : isLoginForm ? 'Sign in' : 'Registration'}
					</Button>
					<div className={styles.toggle}>
						{isLoginForm ? "Don't have an account? - " : 'Already have an account - '}
						<button
							type={'button'}
							onClick={() => setIsLoginForm(!isLoginForm)}
							className={(styles.button, 'text-primary')}
						>
							{isLoginForm ? 'Create new account' : 'Sign in'}
						</button>
					</div>
				</form>
			</div>
			<div className={styles.right}>
				<Image src={'/images/logo.svg'} height={150} width={150} alt={'Auth'} />
			</div>
		</div>
	);
};

export default Auth;
