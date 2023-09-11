import { create } from 'zustand';

import { User } from '@/types/user';

interface State {
	user: User | null;
	isLoading: boolean;
	error: any;
}

interface Actions {
	fetchUser: (id: string) => Promise<void>;
}

const INITIAL_STATE: State = {
	user: null,
	isLoading: false,
	error: null,
};

export const useUserStore = create<State & Actions>((set) => ({
	user: INITIAL_STATE.user,
	isLoading: INITIAL_STATE.isLoading,
	error: INITIAL_STATE.error,
	fetchUser: async (id: string) => {
		try {
			set({ isLoading: true, error: null });
			const response = await fetch(`/api/user/${id}`);
			const data = await response.json();
			set({ user: data.user, isLoading: false });
		} catch (error) {
			set({ error, isLoading: false });
		}
	},
}));
