import { create } from 'zustand';
import { User } from '@/types/user';

interface State {
	isProfileOpen: boolean;
}

interface Actions {
	setIsProfileOpen: (isProfileOpen: boolean) => void;
}

const INITIAL_STATE: State = {
	isProfileOpen: false,
};

export const useModalStore = create<State & Actions>((set) => ({
	isProfileOpen: INITIAL_STATE.isProfileOpen,
	setIsProfileOpen: (isProfileOpen: boolean) => set({ isProfileOpen }),
}));
