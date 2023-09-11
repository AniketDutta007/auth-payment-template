import { withAuth, NextRequestWithAuth } from 'next-auth/middleware';
export default withAuth(
	function middleware(req: NextRequestWithAuth) {
		console.log(req.url);
		console.log(req.nextUrl.pathname.toString());
	},
	{
		callbacks: {
			authorized({ token }) {
				return !!token;
			},
		},
		pages: {
			signIn: '/auth/signin',
			verifyRequest: '/auth/verify-request',
			error: '/auth/signin',
		},
	}
);
export const config = { matcher: '/dashboard/:path*' };
