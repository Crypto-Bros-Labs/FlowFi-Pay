import { createContext } from 'react';

export type Currency = 'MXN' | 'USD';

export interface CurrencyContextType {
    currency: Currency;
    setCurrency: (currency: Currency) => void;
    usdToMxnRate: number;
    mxnToUsdRate: number;
    setUsdToMxnRate: (rate: number) => void;
    setMxnToUsdRate: (rate: number) => void;
    currencySymbol: string;
    availableCurrencies: Currency[];
}

export const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);



