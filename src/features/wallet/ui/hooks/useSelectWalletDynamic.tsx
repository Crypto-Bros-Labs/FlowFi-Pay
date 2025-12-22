import { useState, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import type { DynamicToken } from "./useSelectTokenDynamic";
import type { TransactionType } from "./useSetAmountDynamic";

export interface UseSelectWalletDynamicProps {
  title?: string;
  token?: DynamicToken;
  availableCrypto?: number;
  showSwitchCoin?: boolean;
  typeTransaction?: TransactionType;
  onContinue?: (amount: string, token: DynamicToken) => void;
}

export const useSelectWalletDynamic = (props: UseSelectWalletDynamicProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [transferAddress, setTransferAddress] = useState<string>("");
  const [selectedWalletAddress, setSelectedWalletAddress] =
    useState<string>("");

  // ✅ Obtener valores del state o props
  const title = useMemo(
    () => props.title || location.state?.title,
    [props.title, location.state?.title]
  );
  const token = useMemo(
    () => props.token || location.state?.token,
    [props.token, location.state?.token]
  );
  const availableCrypto = useMemo(
    () =>
      props.availableCrypto !== undefined
        ? props.availableCrypto
        : location.state?.availableCrypto,
    [props.availableCrypto, location.state?.availableCrypto]
  );
  const showSwitchCoin = useMemo(
    () =>
      props.showSwitchCoin !== undefined
        ? props.showSwitchCoin
        : location.state?.showSwitchCoin,
    [props.showSwitchCoin, location.state?.showSwitchCoin]
  );
  const typeTransaction = useMemo(
    () =>
      (props.typeTransaction ||
        location.state?.typeTransaction ||
        "buy") as TransactionType,
    [props.typeTransaction, location.state?.typeTransaction]
  );
  const onContinue = useMemo(
    () => props.onContinue || location.state?.onContinue,
    [props.onContinue, location.state?.onContinue]
  );

  // ✅ Determinar la dirección final (wallet seleccionada o dirección escrita)
  const finalAddress = useMemo(() => {
    return transferAddress.trim() || selectedWalletAddress;
  }, [transferAddress, selectedWalletAddress]);

  // ✅ Validar dirección (básico)
  const isValidAddress = useCallback((address: string): boolean => {
    if (!address.trim()) return false;

    // Validación básica de dirección Ethereum/EVM (40 caracteres hex después de 0x)
    const ethPattern = /^0x[a-fA-F0-9]{40}$/;

    // Validación StarkNet (hasta 64 caracteres hex)
    const starkPattern = /^0x[0-9a-fA-F]{1,64}$/;

    // Validación Solana (Base58)
    const solanaPattern = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

    return (
      ethPattern.test(address) ||
      starkPattern.test(address) ||
      solanaPattern.test(address)
    );
  }, []);

  // ✅ Validar si se puede continuar
  const canContinue = useMemo(() => {
    return finalAddress.length > 0 && isValidAddress(finalAddress);
  }, [finalAddress, isValidAddress]);

  // ✅ Manejar selección de wallet guardada
  const handleWalletSelect = useCallback((walletAddress: string) => {
    setSelectedWalletAddress(walletAddress);
    setTransferAddress(""); // Limpiar el input manual
  }, []);

  // ✅ Manejar cambio en el input de transferencia
  const handleTransferAddressChange = useCallback((address: string) => {
    setTransferAddress(address);
    if (address.trim()) {
      setSelectedWalletAddress(""); // Limpiar selección si el usuario escribe
    }
  }, []);

  // ✅ Navegar a SetAmountDynamicPage con el wallet address
  const handleContinue = useCallback(() => {
    if (!canContinue) {
      console.warn("Dirección inválida o no seleccionada");
      return;
    }

    // ✅ Pasar todos los parámetros necesarios en el state
    navigate("/set-amount-dynamic", {
      state: {
        title,
        token,
        availableCrypto:
          typeTransaction === "buy" ? undefined : availableCrypto,
        showSwitchCoin,
        typeTransaction,
        onContinue,
        scannedAddress: finalAddress, // ✅ IMPORTANTE: Nombre del parámetro que espera SetAmountDynamic
      },
      replace: true,
    });
  }, [
    navigate,
    title,
    token,
    availableCrypto,
    showSwitchCoin,
    typeTransaction,
    onContinue,
    finalAddress,
    canContinue,
  ]);

  // ✅ Manejar escaneo de QR
  const handleScanQR = useCallback(() => {
    navigate("/wallet/qr-scanner", {
      state: {
        returnPath: location.pathname,
        title,
        token,
        availableCrypto,
        showSwitchCoin,
        typeTransaction,
        onContinue,
      },
    });
  }, [
    navigate,
    location.pathname,
    title,
    token,
    availableCrypto,
    showSwitchCoin,
    typeTransaction,
    onContinue,
  ]);

  return {
    // ✅ Estado
    transferAddress,
    selectedWalletAddress,
    finalAddress,

    // ✅ Handlers
    handleTransferAddressChange,
    handleWalletSelect,
    handleContinue,
    handleScanQR,

    // ✅ Validaciones
    isValidAddress,
    canContinue,

    // ✅ Props obtenidos
    title,
    token,
    availableCrypto,
    showSwitchCoin,
    typeTransaction,
    onContinue,
  };
};
