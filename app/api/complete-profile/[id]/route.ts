import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/server/db/client';
import { sendWelcomeEmail } from '@/mail/welcome';

const completeProfileSchema = z.object({
	name: z
		.string()
		.min(3, { message: 'Name must be atleast 3 characters long' }),
});

export async function POST(
	req: NextRequest,
	{ params: { id } }: { params: { id: string } }
) {
	try {
		const parsedData = completeProfileSchema.safeParse(await req.json());
		if (!parsedData.success) {
			return NextResponse.json(
				{
					errors: parsedData.error.formErrors.fieldErrors,
				},
				{ status: 400 }
			);
		} else {
			const { name } = parsedData.data;
			const userExists = await prisma.user.findUnique({
				where: {
					id,
				},
			});
			if (userExists) {
				const user = await prisma.user.update({
					where: {
						id,
					},
					data: {
						name,
						isComplete: true,
					},
				});
				sendWelcomeEmail(user.name || 'Mr.', user.email);
				return NextResponse.json(null, { status: 200 });
			} else {
				console.log('Invalid Id');
				return NextResponse.json(
					{ message: 'Invalid user id' },
					{ status: 400 }
				);
			}
		}
	} catch (error) {
		console.log(error);
	}
}
