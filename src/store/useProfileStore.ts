import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Contact {
    id: string;
    name: string;
    phone: string;
}

interface ProfileState {
    name: string;
    email: string;
    phone: string;
    medicalNotes: string;
    contacts: Contact[];
    isSetupComplete: boolean;
    isAuthenticated: boolean;
    token: string | null;
    setProfile: (data: Partial<ProfileState>) => void;
    addContact: (contact: Contact) => void;
    removeContact: (id: string) => void;
    completeSetup: () => void;
    clearProfile: () => void;
    loginUser: (data: { email: string; token: string; user?: { name?: string; phone?: string; medicalNotes?: string; contacts?: Contact[] } }) => void;
    logoutUser: () => void;
}

export const useProfileStore = create<ProfileState>()(
    persist(
        (set) => ({
            name: '',
            email: '',
            phone: '',
            medicalNotes: '',
            contacts: [],
            isSetupComplete: false,
            isAuthenticated: false,
            token: null,
            setProfile: (data) => set((state) => ({ ...state, ...data })),
            addContact: (contact) => set((state) => ({ contacts: [...state.contacts, contact] })),
            removeContact: (id) => set((state) => ({ contacts: state.contacts.filter((c) => c.id !== id) })),
            completeSetup: () => set({ isSetupComplete: true, isAuthenticated: true }),
            clearProfile: () => set({ name: '', email: '', phone: '', medicalNotes: '', contacts: [], isSetupComplete: false, isAuthenticated: false, token: null }),
            loginUser: ({ email, token, user }) =>
                set((state) => ({
                    ...state,
                    email,
                    token,
                    isAuthenticated: true,
                    isSetupComplete: true,
                    ...(user?.name ? { name: user.name } : {}),
                    ...(user?.phone ? { phone: user.phone } : {}),
                    ...(user?.medicalNotes ? { medicalNotes: user.medicalNotes } : {}),
                    ...(user?.contacts ? { contacts: user.contacts } : {}),
                })),
            logoutUser: () =>
                set({
                    name: '',
                    email: '',
                    phone: '',
                    medicalNotes: '',
                    contacts: [],
                    isSetupComplete: false,
                    isAuthenticated: false,
                    token: null,
                }),
        }),
        {
            name: 'guardianher_profile_v1',
        }
    )
);
