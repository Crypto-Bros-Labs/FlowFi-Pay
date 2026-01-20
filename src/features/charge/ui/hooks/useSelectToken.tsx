import { useState } from "react";
import tokenRepository from "../../data/repositories/tokenRepository";
import type { Token } from "../../data/local/tokenLocalService";
import { useNavigate } from "react-router-dom";

type UseSelectTokenProps = {
  tokens: Token[];
};

export const useSelectToken = ({ tokens }: UseSelectTokenProps) => {
  // Estados para tokens
  const [selectedToken, setSelectedToken] = useState<string | null>(null);

  // Estado general
  const navigate = useNavigate();

  // Funciones de selección
  const selectToken = (tokenId: string) => {
    setSelectedToken(tokenId);
  };

  const clearTokenSelection = () => {
    setSelectedToken(null);
  };

  // Getters
  const getSelectedToken = (): Token | undefined => {
    return tokens.find((token) => token.id === selectedToken);
  };

  // Funciones de acción
  const handleBuy = () => {
    const token = getSelectedToken();

    if (token) {
      tokenRepository.setSelectedToken(token);

      navigate("/set-amount");
    } else {
      console.warn("Token o currency no seleccionados");
    }
  };

  return {
    // Tokens
    tokens,
    selectedToken,
    selectToken,
    clearTokenSelection,
    getSelectedToken,

    // Actions
    handleBuy,
  };
};
