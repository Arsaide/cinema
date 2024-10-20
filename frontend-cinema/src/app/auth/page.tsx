import { Metadata } from 'next';
import React from 'react';

import Auth from '@/app/auth/Auth';

export const metadata: Metadata = {
	title: 'Authorization',
};

const AuthPage = () => {
	return <Auth />;
};

export default AuthPage;
