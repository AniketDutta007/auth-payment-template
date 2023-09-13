export type User = {
	id: string;
	name?: string;
	email: string;
	emailVerified?: Date;
	isComplete: boolean;
	image?: string;
	linkedAccounts: string[];
};
