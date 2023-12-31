'use client';
import { useEffect, useState } from 'react';
import { redirect, useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useToast } from '@/components/ui/use-toast';

import { Button } from '@/components/ui/button';
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
import { FcGoogle } from 'react-icons/fc';
import { ReloadIcon } from '@radix-ui/react-icons';
import { Separator } from '@radix-ui/react-dropdown-menu';

const signInSchema = z.object({
	email: z.string().email({
		message: 'Invalid Email',
	}),
});

export default function SignIn({
	searchParams: { error },
}: {
	searchParams: {
		error: string | null;
	};
}) {
	const { toast } = useToast();
	const router = useRouter();
	const [loading, setLoading] = useState<boolean>(false);
	useEffect(() => {
		if (error) {
			toast({
				variant: 'destructive',
				title: 'Uh oh! Something went wrong.',
				description: 'There was a problem with your request.',
			});
		}
	}, [router, error, toast]);

	const form = useForm<z.infer<typeof signInSchema>>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			email: '',
		},
	});
	async function onSubmit(values: z.infer<typeof signInSchema>) {
		try {
			setLoading(true);
			const res = await signIn('email', {
				email: values.email,
				redirect: true,
				callbackUrl: '/dashboard',
			});
			if (res?.error) {
				throw new Error(res.error);
			}
		} catch (error) {
			console.log(error);
			toast({
				variant: 'destructive',
				title: 'Uh oh! Something went wrong.',
				description: 'There was a problem with your request.',
			});
		} finally {
			setLoading(false);
		}
	}

	async function handleGoogleSignIn() {
		try {
			// setLoading(true);
			const res = await signIn('google', {
				redirect: true,
				callbackUrl: '/dashboard',
			});
			if (res?.error) {
				throw new Error(res.error);
			}
		} catch (error) {
			console.log(error);
			toast({
				variant: 'destructive',
				title: 'Uh oh! Something went wrong.',
				description: 'There was a problem with your request.',
			});
		} finally {
			// setLoading(false);
		}
	}

	return (
		<div className='w-[80%] max-w-md px-5 py-5 border border-muted rounded-md'>
			<div className='space-y-2'>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className='space-y-4'
					>
						<FormField
							control={form.control}
							name='email'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											type='email'
											placeholder='john@gmail.com'
											{...field}
											disabled={loading}
										/>
									</FormControl>
									{/* <FormDescription>
									This is your login for email.
								</FormDescription> */}
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className='w-[100%] flex justify-end items-center'>
							<Button
								type='submit'
								variant='secondary'
								disabled={loading}
							>
								{loading ? (
									<>
										<ReloadIcon className='mr-2 h-4 w-4 animate-spin' />
										<span>Loggin In</span>
									</>
								) : (
									<>Log In</>
								)}
							</Button>
						</div>
					</form>
				</Form>
				<div className='w-[100%] flex justify-center items-center gap-3'>
					<Separator className='grow h-1 border-t-2 border-t-accent' />
					<span>OR</span>
					<Separator className='grow h-1 border-t-2 border-t-muted' />
				</div>
				<div className='w-[100%] flex justify-center items-center'>
					<Button
						className='flex justify-center items-center gap-4 rounded-full px-6'
						onClick={handleGoogleSignIn}
					>
						<FcGoogle />
						Google
					</Button>
				</div>
			</div>
		</div>
	);
}
