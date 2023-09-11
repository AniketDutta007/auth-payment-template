'use client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { ReloadIcon } from '@radix-ui/react-icons';
import { useUserStore } from '@/stores/useUserStore';

const profileSchema = z.object({
	name: z
		.string()
		.min(3, { message: 'Name must be atleast 3 characters long' }),
	email: z.string().email(),
});

export default function CompleteProfile() {
	const { data: session } = useSession();
	const { fetchUser } = useUserStore();

	const form = useForm<z.infer<typeof profileSchema>>({
		resolver: zodResolver(profileSchema),
		defaultValues: {
			name: '',
			email: session?.user.email,
		},
	});
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		if (session?.user && !session.user.isComplete) {
			form.setValue('email', session.user.email);
			setIsOpen(true);
		} else {
			setIsOpen(false);
		}
	}, [session?.user]);

	async function onSubmit(values: z.infer<typeof profileSchema>) {
		try {
			setLoading(true);
			const res = await fetch(
				`/api/complete-profile/${session?.user.id}`,
				{
					method: 'POST',
					body: JSON.stringify({
						name: values.name,
					}),
				}
			);
			if (res.ok) {
				session?.user && (await fetchUser(session.user.id));
				setIsOpen(false);
				form.reset();
			}
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	}

	return (
		<Dialog open={isOpen} onOpenChange={() => {}}>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>Complete profile</DialogTitle>
					<DialogDescription>
						Make changes to your profile here. Click save when
						you&apos;re done.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className='space-y-8'
					>
						<div className='space-y-2'>
							<FormField
								control={form.control}
								name='name'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Name</FormLabel>
										<FormControl>
											<Input
												placeholder='John Doe'
												{...field}
												disabled={loading}
											/>
										</FormControl>
										<FormDescription>
											This is your public display name.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='email'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input
												type='email'
												placeholder='johndoe2002@gmail.com'
												{...field}
												disabled
											/>
										</FormControl>
										{/* <FormDescription>
										This is your public display name.
									</FormDescription> */}
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<DialogFooter>
							<Button type='submit' disabled={loading}>
								{loading ? (
									<>
										<ReloadIcon className='mr-2 h-4 w-4 animate-spin' />
										<span>Please wait</span>
									</>
								) : (
									<>Save Changes</>
								)}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
