import { NextRequest, NextResponse } from 'next/server';

import { EnumTokens } from '@/api/services/auth/auth-token.service';
import { userService } from '@/api/services/user/user.service';

import { ADMIN_URL, DASHBOARD_URL, PUBLIC_URL } from '@/config/url.config';

import { UserRole } from '@/types/user.types';

export const middleware = async (request: NextRequest) => {
	const refreshToken = request.cookies.get(EnumTokens.REFRESH_TOKEN)?.value;
	const accessToken = request.cookies.get(EnumTokens.ACCESS_TOKEN)?.value;

	const isAuthPage = request.url.includes(PUBLIC_URL.auth());
	const isAdminPage = request.url.includes(ADMIN_URL.root());

	if (isAuthPage) {
		if (refreshToken && accessToken) {
			return NextResponse.redirect(new URL(DASHBOARD_URL.root(), request.url));
		}

		return NextResponse.next();
	}

	if (refreshToken === undefined) {
		return NextResponse.rewrite(new URL(isAdminPage ? '/404' : PUBLIC_URL.auth(), request.url));
	}

	try {
		const profile = await userService.getProfileMiddleware(refreshToken);

		console.log(profile);

		if (profile.role === UserRole.ADMIN) {
			return NextResponse.next();
		}

		if (isAdminPage) {
			return NextResponse.rewrite(new URL('/404', request.url));
		}

		return NextResponse.next();
	} catch (error) {
		console.error(error);
		request.cookies.delete(EnumTokens.REFRESH_TOKEN);
		return NextResponse.redirect(new URL(PUBLIC_URL.auth(), request.url));
	}
};

export const config = {
	matcher: ['/dashboard/:path*', '/admin/:path*', '/auth'],
};
