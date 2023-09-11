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

export default function Profile() {
	const { user, isLoading } = useUserStore();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild disabled={isLoading}>
				<div className=''>
					<Avatar>
						<AvatarImage
							src='https://github.com/shadcn.png'
							alt='@shadcn'
						/>
						<AvatarFallback>CN</AvatarFallback>
					</Avatar>
				</div>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-56'>
				<DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem>Profile</DropdownMenuItem>
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
