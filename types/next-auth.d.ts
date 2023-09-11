import { DefaultSession, DefaultUser } from 'next-auth';
import { JWT, DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
	interface Session extends DefaultSession {
		user: DefaultUser & {
			id: string;
			email: string;
			emailVerified: Date;
			isComplete: boolean;
		};
	}
	interface User extends DefaultUser {
		id: string;
		email: string;
		emailVerified: Date;
		isComplete: boolean;
	}
}

declare module 'next-auth/jwt' {
	interface JWT extends DefaultJWT {
		id: string;
		email: string;
		emailVerified: Date;
		isComplete: boolean;
	}
}
