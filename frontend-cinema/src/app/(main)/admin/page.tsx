import { Metadata } from 'next';
import React from 'react';

import { NO_INDEX_PAGE } from '@/constants/seo.constants';

export const metadata: Metadata = {
	title: 'Admin panel',
	...NO_INDEX_PAGE,
};

const AdminPage = () => {
	return <div>Admin</div>;
};

export default AdminPage;
