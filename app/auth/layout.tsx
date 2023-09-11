import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await getServerSession();
	if (session?.user) {
		redirect('/dashboard');
	}
	return (
		<main className='w-[100%] h-[100%] flex justify-center items-center'>
			{children}
		</main>
	);
}
