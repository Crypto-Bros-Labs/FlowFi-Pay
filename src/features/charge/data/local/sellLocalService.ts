import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { OffRampData } from "../models/sellModel";

export interface Amounts {
    amountFiat: string;
    amountToken: string;
}

export interface SellData {
    kycUrl: string;
    destinationWalletAddress: string;
}

interface SellLocalState {
    // Ramp data
    offRampData: OffRampData | null;
    amounts?: Amounts | null;
    sellData: SellData | null;

    // Actions
    setOffRampData: (data: OffRampData | null) => void;
    setAmounts?: (amounts: Amounts | null) => void;
    setSellData: (data: SellData | null) => void;
    clearAll: () => void;
}

const useSellLocalService = create<SellLocalState>()(
    persist(
        (set) => ({
            // Initial state
            offRampData: null,
            amounts: {
                amountFiat: '1000',
                amountToken: '0.00'
            },
            sellData: null,

            // Actions
            setOffRampData: (data: OffRampData | null) => set({ offRampData: data }),
            setAmounts: (amounts: Amounts | null) => set({ amounts }),
            setSellData: (data: SellData | null) => set({ sellData: data }),
            clearAll: () => set({ offRampData: null, amounts: null, sellData: null }),
        }),
        {
            name: "sell-local",
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
                offRampData: state.offRampData,
                amounts: state.amounts,
                sellData: state.sellData
            } as SellLocalState), // Persist only the necessary state,
            version: 1,
        }
    )
);

class SellLocalService {
    private useStore = useSellLocalService;
    private get store() {
        return this.useStore.getState();
    }

    getOffRampData(): OffRampData | null {
        return this.store.offRampData;
    }

    getAmounts(): Amounts | null {
        return this.store.amounts ?? null;
    }

    setOffRampData(data: OffRampData | null): void {
        this.store.setOffRampData(data);
    }

    setAmounts(amounts: Amounts | null): void {
        this.store.setAmounts?.(amounts);
    }

    //Actions
    getStore(): SellLocalState {
        return this.store;
    }

    clearAll(): void {
        this.store.clearAll();
    }

    clearAmounts(): void {
        this.store.setAmounts?.(null);
    }

    getAmountFiat(): string | null {
        return this.store.amounts?.amountFiat ?? null;
    }

    getAmountToken(): string | null {
        return this.store.amounts?.amountToken ?? null;
    }

    setAmountFiat(amountFiat: string): void {
        this.store.setAmounts?.({
            amountFiat,
            amountToken: this.store.amounts?.amountToken ?? ""
        });
    }

    setAmountToken(amountToken: string): void {
        this.store.setAmounts?.({
            amountFiat: this.store.amounts?.amountFiat ?? "",
            amountToken
        });
    }

    setSellData(data: SellData | null): void {
        console.log('🔄 SellLocalService.setSellData llamado con:', data);
        this.store.setSellData(data);

        // Verificar que se guardó
        const verification = this.getSellData();
        console.log('✅ Verificación después de guardar:', verification);
    }

    getSellData(): SellData | null {
        const data = this.store.sellData;
        console.log('📖 getSellData retorna:', data);
        return data;
    }

    setUserUuid(userUuid: string): void {
        const offRampData = this.store.offRampData;
        if (!offRampData) return;
        this.store.setOffRampData?.({
            ...offRampData,
            userUuid,
            providerUuid: offRampData.providerUuid ?? "",
            tokenNetworkUuid: offRampData.tokenNetworkUuid ?? "",
            fiatCurrencyUuid: offRampData.fiatCurrencyUuid ?? "",
            userBankInformationUuid: offRampData.userBankInformationUuid ?? "",
            amount: offRampData.amount
        });
    }

    setProviderUuid(providerUuid: string): void {
        const offRampData = this.store.offRampData;
        if (!offRampData) return;
        this.store.setOffRampData?.({
            ...offRampData,
            userUuid: offRampData.userUuid ?? "",
            providerUuid,
            tokenNetworkUuid: offRampData.tokenNetworkUuid ?? "",
            fiatCurrencyUuid: offRampData.fiatCurrencyUuid ?? "",
            userBankInformationUuid: offRampData.userBankInformationUuid ?? "",
            amount: offRampData.amount
        });
    }

    setTokenNetworkUuid(tokenNetworkUuid: string): void {
        const offRampData = this.store.offRampData;
        if (!offRampData) return;
        this.store.setOffRampData?.({
            ...offRampData,
            userUuid: offRampData.userUuid ?? "",
            providerUuid: offRampData.providerUuid ?? "",
            tokenNetworkUuid,
            fiatCurrencyUuid: offRampData.fiatCurrencyUuid ?? "",
            userBankInformationUuid: offRampData.userBankInformationUuid ?? "",
            amount: offRampData.amount
        });
    }

    setFiatCurrencyUuid(fiatCurrencyUuid: string): void {
        const offRampData = this.store.offRampData;
        if (!offRampData) return;
        this.store.setOffRampData?.({
            ...offRampData,
            userUuid: offRampData.userUuid ?? "",
            providerUuid: offRampData.providerUuid ?? "",
            tokenNetworkUuid: offRampData.tokenNetworkUuid ?? "",
            fiatCurrencyUuid,
            userBankInformationUuid: offRampData.userBankInformationUuid ?? "",
            amount: offRampData.amount
        });
    }

    setUserBankInformationUuid(userBankInformationUuid: string): void {
        const offRampData = this.store.offRampData;
        if (!offRampData) return;
        this.store.setOffRampData?.({
            ...offRampData,
            userUuid: offRampData.userUuid ?? "",
            providerUuid: offRampData.providerUuid ?? "",
            tokenNetworkUuid: offRampData.tokenNetworkUuid ?? "",
            fiatCurrencyUuid: offRampData.fiatCurrencyUuid ?? "",
            userBankInformationUuid,
            amount: offRampData.amount
        });
    }

    setAmountFiatOffRamp(amount: number): void {
        const offRampData = this.store.offRampData;
        if (!offRampData) return;
        this.store.setOffRampData?.({
            ...offRampData,
            userUuid: offRampData.userUuid ?? "",
            providerUuid: offRampData.providerUuid ?? "",
            tokenNetworkUuid: offRampData.tokenNetworkUuid ?? "",
            fiatCurrencyUuid: offRampData.fiatCurrencyUuid ?? "",
            userBankInformationUuid: offRampData.userBankInformationUuid ?? "",
            amount
        });
    }

}

export default new SellLocalService();