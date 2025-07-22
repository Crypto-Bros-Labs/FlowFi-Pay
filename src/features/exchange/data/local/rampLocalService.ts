import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface OnRampData {
    name: string;
    entity: string;
    clabe: string;
}

export interface Amounts {
    amount: string;
    amountFiat: string;
}

interface RampLocalState {
    // Ramp data
    onRampData: OnRampData | null;
    amounts?: Amounts | null;

    // Actions
    setOnRampData: (data: OnRampData | null) => void;
    setAmounts?: (amounts: Amounts | null) => void;
    clearAll: () => void;
}

const useRampLocalService = create<RampLocalState>()(
    persist(
        (set) => ({
            // Initial state
            onRampData: null,
            amounts: null,

            // Actions
            setOnRampData: (data: OnRampData | null) => set({ onRampData: data }),
            setAmounts: (amounts: Amounts | null) => set({ amounts }),
            clearAmounts: () => set({ amounts: null }),
            clearAll: () => set({ onRampData: null }),
        }),
        {
            name: "ramp-local",
            storage: {
                getItem: (name) => {
                    const value = localStorage.getItem(name);
                    return value ? JSON.parse(value) : null;
                },
                setItem: (name, value) => {
                    localStorage.setItem(name, JSON.stringify(value));
                },
                removeItem: (name) => {
                    localStorage.removeItem(name);
                },
            },
            partialize: (state) => ({
                onRampData: state.onRampData,
                amounts: state.amounts
            } as RampLocalState), // Persist only the necessary state,
            version: 1,
        }
    )
);

class RampLocalService {
    private store = useRampLocalService;

    setOnRampData(data: OnRampData | null): void {
        this.store.setState({ onRampData: data });
    }

    getOnRampData(): OnRampData | null {
        return this.store.getState().onRampData || null;
    }

    setAmounts(amounts: Amounts | null): void {
        this.store.setState({ amounts });
    }

    getAmounts(): Amounts | null {
        return this.store.getState().amounts || null;
    }

    clearAmounts(): void {
        this.store.setState({ amounts: null });
    }

    clearAll(): void {
        this.store.getState().clearAll();
    }
}

export default new RampLocalService();