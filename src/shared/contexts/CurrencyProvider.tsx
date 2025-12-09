import { useEffect, useState, type ReactNode } from "react";
import { CurrencyContext, type Currency } from "./CurrencyContext";
import { useUsdToMxnRate } from "../hooks/useUsdToMxnRate";


const CURRENCY_STORAGE_KEY = 'flowfi-currency-preference';
const DEFAULT_CURRENCY: Currency = 'MXN';

// ✅ Mapeo de símbolos por moneda
const CURRENCY_SYMBOLS: Record<Currency, string> = {
    MXN: '$',
    USD: '$',
};

// ✅ Monedas disponibles
const AVAILABLE_CURRENCIES: Currency[] = ['MXN', 'USD'];

interface CurrencyProviderProps {
    children: ReactNode;
}

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({ children }) => {
    const [currency, setCurrencyState] = useState<Currency>(DEFAULT_CURRENCY);
    const [usdToMxnRate, setUsdToMxnRate] = useState<number>(18.30);
    const [mxnToUsdRate, setMxnToUsdRate] = useState<number>(0.055);
    const [isHydrated, setIsHydrated] = useState(false);

    const { rate } = useUsdToMxnRate();

    // ✅ Cargar preferencia del storage al montar
    useEffect(() => {
        const savedCurrency = localStorage.getItem(CURRENCY_STORAGE_KEY) as Currency | null;

        if (savedCurrency && AVAILABLE_CURRENCIES.includes(savedCurrency)) {
            setCurrencyState(savedCurrency);
        } else {
            setCurrencyState(DEFAULT_CURRENCY);
        }

        if (rate) {
            setUsdToMxnRate(rate);
            setMxnToUsdRate(1 / rate);
        }

        setIsHydrated(true);
    }, [rate]);

    // ✅ Función para cambiar moneda con persistencia
    const setCurrency = (newCurrency: Currency) => {
        if (AVAILABLE_CURRENCIES.includes(newCurrency)) {
            setCurrencyState(newCurrency);
            localStorage.setItem(CURRENCY_STORAGE_KEY, newCurrency);
        }
    };


    const currencySymbol = CURRENCY_SYMBOLS[currency];

    if (!isHydrated) {
        return <>{children}</>;
    }

    return (
        <CurrencyContext.Provider
            value={{
                currency,
                setCurrency,
                usdToMxnRate,
                mxnToUsdRate,
                setUsdToMxnRate,
                setMxnToUsdRate,
                currencySymbol,
                availableCurrencies: AVAILABLE_CURRENCIES,
            }}
        >
            {children}
        </CurrencyContext.Provider>
    );
};