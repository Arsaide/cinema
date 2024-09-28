import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import type { Metadata } from 'next';

import Providers from '@/app/providers';

import '@/assets/styles/globals.scss';

import { APP_URL } from '@/config/url.config';

import { SITE_DESCRIPTION, SITE_NAME } from '@/constants/seo.constants';

export const metadata: Metadata = {
	title: {
		absolute: SITE_NAME,
		template: `%s | ${SITE_NAME}`,
	},
	description: SITE_DESCRIPTION,
	metadataBase: new URL(APP_URL),
	openGraph: {
		type: 'website',
		siteName: SITE_NAME,
		emails: ['arsaidekm@gmail.com'],
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en' className={`${GeistSans.variable} ${GeistMono.variable}`}>
			<body>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
