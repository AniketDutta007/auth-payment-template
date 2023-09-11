import Link from 'next/link';

export default function VerifyRequest() {
	return (
		<div className='w-full max-w-md px-7 py-5 flex flex-col justify-center items-center gap-5 border border-muted rounded-md'>
			<span className='text-xl font-bold text-primary'>
				Verification Mail Sent
			</span>
			<Link href='/auth/signin' className='text-primary/25 font-semibold'>
				Change E-mail Address
			</Link>
		</div>
	);
}
