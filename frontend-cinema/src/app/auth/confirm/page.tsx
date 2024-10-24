import { Metadata } from 'next';
import React from 'react';

import Confirm from '@/app/auth/confirm/Confirm';

import { NO_INDEX_PAGE } from '@/constants/seo.constants';

export const metadata: Metadata = {
	title: 'Confirm email',
	...NO_INDEX_PAGE,
};

const ConfirmPage = () => {
	return <Confirm />;
};

export default ConfirmPage;
