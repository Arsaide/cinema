import { Metadata } from 'next';
import React from 'react';

import Dashboard from '@/app/(main)/dashboard/Dashboard';

import { NO_INDEX_PAGE } from '@/constants/seo.constants';

export const metadata: Metadata = {
	title: 'Dashboard',
	...NO_INDEX_PAGE,
};

const DashboardPage = () => {
	return <Dashboard />;
};

export default DashboardPage;
