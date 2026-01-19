import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export type DynamicToken = {
  id: string;
  symbol: string;
  name: string;
  network: string;
  iconUrl: string;
};

interface UseSelectTokenDynamicProps {
  tokens: DynamicToken[];
  redirectPath?: string;
  transactionType?: "buy" | "sell" | "transfer";
  externalAddress?: boolean;
}

export const useSelectTokenDynamic = ({
  tokens,
  redirectPath,
  transactionType,
  externalAddress,
}: UseSelectTokenDynamicProps) => {
  const navigate = useNavigate();
  const [selectedToken, setSelectedToken] = useState<string | null>(null);

  // ✅ Seleccionar token
  const selectToken = useCallback((tokenId: string) => {
    setSelectedToken(tokenId);
  }, []);

  // ✅ Obtener token seleccionado
  const getSelectedToken = useCallback((): DynamicToken | undefined => {
    return tokens.find((token) => token.id === selectedToken);
  }, [tokens, selectedToken]);

  // ✅ Limpiar selección
  const clearSelection = useCallback(() => {
    setSelectedToken(null);
  }, []);

  // ✅ Continuar con el token seleccionado
  const handleContinue = useCallback(() => {
    const selected = getSelectedToken();

    if (selected) {
      // Ejecutar callback si existe
      if (transactionType == "transfer") {
        navigate("/select-wallet-dynamic", {
          state: {
            token: getSelectedToken(),
            availableCrypto: 0.0,
            showSwitchCoin: true,
            typeTransaction: "transfer",
            title: "Transferir",
          },
        });
      }

      if (transactionType == "buy") {
        navigate("/select-wallet-dynamic", {
          state: {
            token: getSelectedToken(),
            showSwitchCoin: true,
            typeTransaction: "buy",
            title: "Comprar",
          },
        });
      }

      if (transactionType == "sell") {
        navigate("/set-amount-dynamic", {
          state: {
            token: getSelectedToken(),
            availableCrypto: 0.0,
            typeTransaction: "sell",
            title: "Vender",
            externalAddress: externalAddress ?? false,
            showSwitchCoin: true,
          },
        });
      }

      // Redirigir si existe path
      if (redirectPath) {
        navigate(redirectPath);
      }
    } else {
      console.warn("Ningún token seleccionado");
    }
  }, [
    getSelectedToken,
    navigate,
    redirectPath,
    transactionType,
    externalAddress,
  ]);

  // ✅ Verificar si hay token seleccionado
  const isTokenSelected = useCallback((): boolean => {
    return selectedToken !== null;
  }, [selectedToken]);

  return {
    selectedToken,
    selectToken,
    getSelectedToken,
    clearSelection,
    handleContinue,
    isTokenSelected,
    tokens,
  };
};
