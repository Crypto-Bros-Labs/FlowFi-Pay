import { useNavigate } from "react-router-dom";
import { useAccountOptions } from "../../../../shared/hooks/useAccountOptions";
import { useCallback, useEffect, useState } from "react";
import type { Token } from "../../data/local/tokenLocalService";
import tokenRepository from "../../data/repositories/tokenRepository";
import { useDialog } from "../../../../shared/hooks/useDialog";
import { useProfile } from "../../../profile/ui/hooks/useProfile";

export const useMain = () => {
  const navigate = useNavigate();
  const { showDialog } = useDialog();
  const { isAccountOptionsLoading } = useAccountOptions();

  const [tokens, setTokens] = useState<Token[]>([]);
  const [tokensError, setTokensError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { kycStatus, handleKycStatusInfo } = useProfile();

  const buyTokens = [
    ...tokens
      .filter(
        (token) =>
          token.network.toLowerCase() != "starknet" &&
          token.symbol.toUpperCase() === "USDC"
      )
      .map((token) => ({
        id: token.uuid,
        symbol: token.symbol,
        name: token.name,
        network: token.network,
        iconUrl: token.iconUrl,
      })),
  ];

  const dynamicTokens = tokens
    .filter(
      (token) =>
        token.symbol.toUpperCase() === "USDC" &&
        token.network.toLowerCase() === "starknet"
    )
    .map((token) => ({
      id: token.uuid,
      symbol: token.symbol,
      name: token.name,
      network: token.network,
      iconUrl: token.iconUrl,
    }));

  const onHandleSell = () => {
    navigate("/select-token-dynamic", {
      state: {
        title: "Selecciona el token que deseas vender",
        tokens: buyTokens,
        transactionType: "sell",
        externalAddress: true,
      },
    });
  };

  const goToSelectToken = () => {
    showDialog({
      title: "¿Donde quieres recibir el cobro?",
      subtitle:
        "Selecciona si deseas recibir el dinero en tu cuenta bancaria o en esta billetera.",
      onNext: () => {
        if (kycStatus !== "APPROVED") {
          handleKycStatusInfo();
        } else {
          onHandleSell();
        }
      },
      nextText: "Mi cuenta de banco",
      onBack: () => {
        navigate("/select-token");
      },
      backText: "Esta billetera",
      buttonsOrientation: "vertical",
      shouldClose: false,
    });
  };

  const onHandleSend = () => {
    navigate("/select-token-dynamic", {
      state: {
        title: "Selecciona tu token para transferir",
        tokens: dynamicTokens,
        transactionType: "transfer",
      },
    });
  };

  const onHandleBuy = () => {
    navigate("/select-token-dynamic", {
      state: {
        title: "Selecciona el token que deseas comprar",
        tokens: buyTokens,
        transactionType: "buy",
      },
    });
  };

  const onHandleWithdraw = () => {
    navigate("/select-token-dynamic", {
      state: {
        title: "Selecciona el token que deseas vender",
        tokens: dynamicTokens,
        transactionType: "sell",
        externalAddress: false,
      },
    });
  };

  const onHandleReceive = () => {
    navigate("/receive");
  };

  // Función para obtener tokens
  const fetchTokens = useCallback(async (): Promise<Token[]> => {
    try {
      // Simular API call
      const response = await tokenRepository.fetchTokens();

      if (response) {
        // Obtener tokens del repositorio
        const tokens = tokenRepository.getTokens();
        return tokens;
      } else {
        return [];
      }
    } catch (error) {
      throw new Error(
        "Failed to fetch tokens " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    }
  }, []);

  // Cargar tokens
  const loadTokens = useCallback(async () => {
    try {
      setTokensError(null);
      setIsLoading(true);

      const fetchedTokens = await fetchTokens();
      setTokens(fetchedTokens);
      setIsLoading(false);
    } catch (error) {
      setTokensError(
        error instanceof Error ? error.message : "Error loading tokens"
      );
      setIsLoading(false);
      console.error("Error fetching tokens:", error);
    }
  }, [fetchTokens]);

  useEffect(() => {
    loadTokens();
  }, [loadTokens]);

  return {
    goToSelectToken,
    isAccountOptionsLoading,
    onHandleSend,
    onHandleBuy,
    onHandleWithdraw,
    onHandleReceive,
    onHandleSell,
    tokens,
    tokensError,
    isLoading,
    dynamicTokens,
  };
};
