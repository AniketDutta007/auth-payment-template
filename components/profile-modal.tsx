'use client';
import { useUserStore } from '@/stores/useUserStore';
import { useModalStore } from '@/stores/useModalStore';
import { IconType } from 'react-icons/lib';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PROVIDERS, PROVIDER_ICON } from '@/config/providers';
import { FcGoogle } from 'react-icons/fc';
import { BsCheckCircleFill } from 'react-icons/bs';
import { signIn } from 'next-auth/react';

export default function ProfileModal() {
	const { user } = useUserStore();
	const { isProfileOpen, setIsProfileOpen } = useModalStore();
	return (
		<Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>Profile</DialogTitle>
					{/* <DialogDescription>
						Make changes to your profile here. Click save when
						you&apos;re done.
					</DialogDescription> */}
				</DialogHeader>
				<div className='space-y-4 items-center'>
					{/* <div className='h-[100px] aspect-square rounded-full bg-accent mx-auto ring ring-sky ring-offset-[5px] ring-offset-background'>
						
					</div> */}
					<Avatar className='w-[100px] h-[100px] rounded-full bg-accent mx-auto ring ring-sky ring-offset-[4px] ring-offset-background'>
						<AvatarImage src={user?.image} alt='@shadcn' />
						<AvatarFallback>CN</AvatarFallback>
					</Avatar>
					<div className='grid gap-4 py-4'>
						<div className='grid grid-cols-4 items-center gap-4'>
							<Label htmlFor='name' className='text-right'>
								Name
							</Label>
							<Input
								id='name'
								value={user?.name}
								className='col-span-3'
								disabled
							/>
						</div>
						<div className='grid grid-cols-4 items-center gap-4'>
							<Label htmlFor='email' className='text-right'>
								Email
							</Label>
							<Input
								id='email'
								value={user?.email}
								className='col-span-3'
								disabled
							/>
						</div>
						<div className='grid grid-cols-4 items-center gap-4'>
							<Label htmlFor='connect' className='text-right'>
								Connect
							</Label>
							<div className='col-span-3 flex justify-start items-center gap-3'>
								{PROVIDERS.map((provider) => {
									const Icon: IconType =
										PROVIDER_ICON[provider];
									const isConnected =
										user?.linkedAccounts.includes(provider);
									return (
										<div
											className={`relative w-8 h-8 ${
												isConnected
													? 'cursor-not-allowed'
													: 'cursor-pointer'
											}`}
											key={provider}
											onClick={() =>
												!isConnected && signIn('google')
											}
										>
											<Icon className='w-8 h-8' />
											{isConnected && (
												<span className='absolute bottom-2 -left-1 w-1 h-1 text-lime-500'>
													<BsCheckCircleFill />
												</span>
											)}
										</div>
									);
								})}
							</div>
						</div>
					</div>
				</div>
				{/* <DialogFooter>
					<Button type='submit'>Save changes</Button>
				</DialogFooter> */}
			</DialogContent>
		</Dialog>
	);
}
