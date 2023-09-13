'use client';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { useUserStore } from '@/stores/useUserStore';
import { signOut } from 'next-auth/react';
import { useModalStore } from '@/stores/useModalStore';

export default function Profile() {
	const { user, isLoading } = useUserStore();
	const { setIsProfileOpen } = useModalStore();
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild disabled={isLoading}>
				<div className=''>
					<Avatar className='w-8 h-8 aspect-square cursor-pointer'>
						<AvatarImage src={user?.image} alt='profile-pic' />
						<AvatarFallback>CN</AvatarFallback>
					</Avatar>
				</div>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-40 mt-3 mr-3'>
				<DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem onClick={() => setIsProfileOpen(true)}>
						Profile
					</DropdownMenuItem>
					<DropdownMenuItem>Billing</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					onClick={() =>
						signOut({
							// redirect: true,
							// callbackUrl: '/auth/signin',
							redirect: false,
						})
					}
				>
					Log out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
