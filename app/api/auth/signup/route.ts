import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/server/db/client';
import { sendWelcomeEmail } from '@/mail/welcome';

export async function POST(req: NextRequest) {
	const { name, email } = await req.json();
	try {
		const userExists = await prisma.user.findUnique({
			where: {
				email,
			},
		});
		if (userExists && userExists.emailVerified === null) {
			return NextResponse.json(null, { status: 201 });
			// return NextResponse.redirect(new URL('/auth/signin', req.url));
		} else if (!userExists) {
			await prisma.user.create({
				data: {
					name,
					email,
				},
			});
			return NextResponse.json(null, { status: 201 });
			// return NextResponse.redirect(new URL('/auth/signin', req.url));
		}
	} catch (error) {
		console.log(error);
		return NextResponse.json(error);
	}
}
