import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/server/db/client';
export async function GET(
	req: NextRequest,
	{ params: { id } }: { params: { id: string } }
) {
	try {
		const user = await prisma.user.findUniqueOrThrow({
			where: {
				id,
			},
			select: {
				id: true,
				name: true,
				email: true,
				emailVerified: true,
				isComplete: true,
				image: true,
				accounts: {
					select: {
						provider: true,
					},
				},
			},
		});
		return NextResponse.json(
			{
				user,
			},
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json(
			{ error: 'Something error on server' },
			{ status: 400 }
		);
	}
}
