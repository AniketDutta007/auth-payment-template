import { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import EmailProvider from 'next-auth/providers/email';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import { sendVerificationRequest } from '@/mail/verification';
import { Adapter } from 'next-auth/adapters';

const prisma = new PrismaClient();

export const options: AuthOptions = {
	adapter: CustomPrismaAdapter(prisma),
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID || '',
			clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
		}),
		EmailProvider({
			server: process.env.EMAIL_SERVER,
			from: process.env.EMAIL_FROM,
			sendVerificationRequest,
		}),
	],
	session: {
		strategy: 'jwt',
	},
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
				token.name = user.name;
				token.email = user.email;
				token.isComplete = user.isComplete || false;
				token.picture = user.image;
			}
			return token;
		},
		async session({ session, token }) {
			return {
				...session,
				user: {
					...session.user,
					id: token.id,
					name: token.name,
					email: token.email,
					isComplete: token.isComplete,
					image: token.picture,
				},
			};
		},
	},
	events: {
		async signIn({ user, isNewUser }) {
			console.log(user);
			console.log('isNewUser :', isNewUser);
		},
	},
	pages: {
		signIn: '/auth/signin',
		verifyRequest: '/auth/verify-request',
		error: '/auth/signin',
	},
	secret: process.env.NEXTAUTH_SECRET,
};

export function CustomPrismaAdapter(prisma: PrismaClient): Adapter {
	return {
		...PrismaAdapter(prisma),
		createUser: async (data) => {
			return await prisma.user.create({
				data,
			});
		},
		getUser: async (id) => {
			return await prisma.user.findUnique({
				where: {
					id,
				},
			});
		},
		getUserByEmail: async (email) => {
			return await prisma.user.findUnique({
				where: {
					email,
				},
			});
		},
		getUserByAccount: async ({ provider, providerAccountId }) => {
			const account = await prisma.account.findFirst({
				where: {
					provider,
					providerAccountId,
				},
			});
			if (account) {
				return await prisma.user.findUnique({
					where: {
						id: account.userId,
					},
				});
			}
			return null;
		},
		updateUser: async ({ id, ...data }) => {
			return await prisma.user.update({
				where: {
					id,
				},
				data,
			});
		},
		deleteUser: async (id) => {
			return await prisma.user.delete({
				where: {
					id,
				},
			});
		},
		getSessionAndUser: async (sessionToken) => {
			const userAndSession = await prisma.session.findUnique({
				where: {
					sessionToken,
				},
				include: {
					user: true,
				},
			});
			if (!userAndSession) {
				return null;
			}
			const { user, ...session } = userAndSession;
			return { user, session };
		},
	};
}
