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
                amounts: state.amounts
            } as SellLocalState), // Persist only the necessary state,
            version: 1,
        }
    )
);

class SellLocalService {
    private useStore = useSellLocalService;
    private store = this.useStore.getState();

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
        this.store.setSellData(data);
    }

    getSellData(): SellData | null {
        return this.store.sellData;
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
            amountFiat: offRampData.amountFiat
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
            amountFiat: offRampData.amountFiat
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
            amountFiat: offRampData.amountFiat
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
            amountFiat: offRampData.amountFiat
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
            amountFiat: offRampData.amountFiat
        });
    }

    setAmountFiatOffRamp(amountFiat: number): void {
        const offRampData = this.store.offRampData;
        if (!offRampData) return;
        this.store.setOffRampData?.({
            ...offRampData,
            userUuid: offRampData.userUuid ?? "",
            providerUuid: offRampData.providerUuid ?? "",
            tokenNetworkUuid: offRampData.tokenNetworkUuid ?? "",
            fiatCurrencyUuid: offRampData.fiatCurrencyUuid ?? "",
            userBankInformationUuid: offRampData.userBankInformationUuid ?? "",
            amountFiat
        });
    }

}

export default new SellLocalService();