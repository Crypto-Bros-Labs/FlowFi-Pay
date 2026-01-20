import { useNavigate } from "react-router-dom";
import { useDialog } from "../../../../shared/hooks/useDialog";
import { useProfile } from "../../../profile/ui/hooks/useProfile";
import { useAppData } from "../../../../shared/hooks/useAppData";

export const useMain = () => {
  const navigate = useNavigate();
  const { showDialog } = useDialog();
  const { tokens, isLoadingTokens, isLoadingAccounts } = useAppData();
  const { kycStatus, handleKycStatusInfo } = useProfile();

  const buyTokens = [
    ...tokens
      .filter(
        (token) =>
          token.network.toLowerCase() != "starknet" &&
          token.symbol.toUpperCase() === "USDC",
      )
      .sort((a, b) => {
        // Solana primero (índice 0)
        if (a.network.toLowerCase() === "solana") return -1;
        if (b.network.toLowerCase() === "solana") return 1;
        return 0;
      })
      .map((token) => ({
        id: token.uuid,
        symbol: token.symbol,
        name: token.name,
        network: token.network,
        iconUrl: token.iconUrl,
      })),
  ];

  const wldToken = tokens.find(
    (token) =>
      token.symbol.toUpperCase() === "WLD" &&
      token.network.toLowerCase() === "worldcoin",
  );

  const dynamicTokens = tokens
    .filter(
      (token) =>
        token.symbol.toUpperCase() === "USDC" &&
        token.network.toLowerCase() === "starknet",
    )
    .map((token) => ({
      id: token.uuid,
      symbol: token.symbol,
      name: token.name,
      network: token.network,
      iconUrl: token.iconUrl,
    }));

  const chargingTokens = tokens.filter(
    (token) => token.symbol.toUpperCase() === "USDC",
  );

  const onHandleSellWld = () => {
    navigate("/set-amount-dynamic", {
      state: {
        token: wldToken,
        availableCrypto: 0.0,
        typeTransaction: "sell",
        title: "Vender",
        externalAddress: true,
        showSwitchCoin: true,
      },
    });
  };

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
        navigate("/select-token", {
          state: {
            title: "Selecciona tu token para cobrar",
            tokens: chargingTokens,
          },
        });
      },
      backText: "Esta billetera",
      buttonsOrientation: "vertical",
      shouldCloseOnNext: kycStatus !== "APPROVED" ? false : true,
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

  const onHandleBuySell = () => {
    showDialog({
      title: "¿Que deseas realizar?",
      onNext: () => {
        onHandleSell();
      },
      nextText: "Vender",
      onBack: () => {
        onHandleBuy();
      },
      backText: "Comprar",
      buttonsOrientation: "vertical",
    });
  };

  return {
    goToSelectToken,
    isAccountOptionsLoading: isLoadingAccounts,
    onHandleSend,
    onHandleBuy,
    onHandleWithdraw,
    onHandleReceive,
    onHandleSell,
    onHandleBuySell,
    tokens,
    isLoading: isLoadingTokens,
    dynamicTokens,
    wldToken,
    onHandleSellWld,
  };
};
