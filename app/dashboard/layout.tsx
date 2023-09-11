'use client';
import { useEffect } from 'react';
import { ModeToggle } from '@/components/mode-toggle';
import CompleteProfile from '@/components/complete-profile';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useUserStore } from '@/stores/useUserStore';
import Profile from '@/components/profile-menu';
import { useToast } from '@/components/ui/use-toast';

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { toast } = useToast();
	const { data: session } = useSession({
		required: true,
		onUnauthenticated() {
			redirect('/auth/signin');
		},
	});
	const { error, fetchUser } = useUserStore();

	useEffect(() => {
		if (session?.user.id) {
			fetchUser(session.user.id);
		}
	}, [fetchUser, session?.user]);

	return (
		<>
			<nav className='w-[100%] px-5 py-3 flex justify-center items-center gap-3'>
				<div className='grow'></div>
				<ModeToggle />
				<Profile />
			</nav>
			<main className='w-[100%] grow bg-accent overflow-hidden overflow-y-auto'>
				{children}
			</main>
			<CompleteProfile />
		</>
	);
}
