import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface UserState {
    userUuid: string | null;
    hasAllData: boolean | null;
    email: string | null;
    phone: string | null;
    fullName: string | null;
    setAuthData: (data: {
        userUuid: string;
        hasAllData: boolean;
        email: string;
    }) => void;
    setProfileData: (data: {
        phone: string;
        fullName: string;
    }) => void;
    setUserData: (data: {
        email: string;
        fullname: string;
        phone: string;
        hasAllData: boolean;
    }) => void;
    clearUser: () => void;
}

const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            userUuid: null,
            hasAllData: null,
            email: null,
            phone: null,
            fullName: null,

            setAuthData: (data) => set({
                userUuid: data.userUuid,
                hasAllData: data.hasAllData,
                email: data.email
            }),

            setProfileData: (data) => set({
                phone: data.phone,
                fullName: data.fullName
            }),

            setUserData: (data) => set({
                email: data.email,
                fullName: data.fullname,
                phone: data.phone,
                hasAllData: data.hasAllData
            }),

            clearUser: () => set({
                userUuid: null,
                hasAllData: null,
                email: null,
                phone: null,
                fullName: null
            }),
        }),
        {
            name: 'user-storage', // nombre único para el localStorage
            storage: createJSONStorage(() => localStorage), // usar localStorage
            // También puedes configurar qué campos persisten
            partialize: (state) => ({
                userUuid: state.userUuid,
                hasAllData: state.hasAllData,
                email: state.email,
                phone: state.phone,
                fullName: state.fullName,
                // No persistir las funciones
            }),
        }
    )
);

class UserLocalService {
    private getState() {
        return useUserStore.getState();
    }

    setAuthData(data: { userUuid: string; hasAllData: boolean; email: string }): void {
        this.getState().setAuthData(data);
    }

    setProfileData(data: { phone: string; fullName: string }): void {
        this.getState().setProfileData(data);
    }

    setUserData(data: { email: string; fullname: string; phone: string; hasAllData: boolean }): void {
        this.getState().setUserData(data);
    }

    setHasAllData(hasAllData: boolean): void {
        this.getState().setUserData({
            email: this.getState().email || '',
            fullname: this.getState().fullName || '',
            phone: this.getState().phone || '',
            hasAllData: hasAllData
        });
    }

    clearUser(): void {
        this.getState().clearUser();
    }

    getUserData(): Pick<UserState, 'userUuid' | 'hasAllData' | 'email' | 'phone' | 'fullName'> {
        const state = this.getState();
        return {
            userUuid: state.userUuid,
            hasAllData: state.hasAllData,
            email: state.email,
            phone: state.phone,
            fullName: state.fullName,
        };
    }

    hasUserData(): boolean {
        return !!this.getState().userUuid;
    }

    // Debug helper
    debugState(): void {
        console.log('🔍 User State:', this.getState());
        console.log('📱 localStorage:', localStorage.getItem('user-storage'));
    }
}

export default new UserLocalService();