import { useEffect, useState } from "react";
import { formatCryptoAddress } from "../../../../shared/utils/cryptoUtils";
import type { Amounts, SellData } from "../../data/local/sellLocalService";
import type { Token } from "../../data/local/tokenLocalService";
import sellRepository from "../../data/repositories/sellRepository";
import historyRepository from "../../../history/data/repositories/historyRepository";
import tokenRepository from "../../data/repositories/tokenRepository";
import { useProfile } from "../../../profile/ui/hooks/useProfile";
import { parseTransactionStatus } from "../../../../shared/utils/historyUtils";

export const useSellInfo = () => {
  const [walletData, setWalletData] = useState<SellData | null>(null);
  const [amounts, setAmounts] = useState<Amounts | null>(null);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [isCancelLoading, setIsCancelLoading] = useState<boolean>(false);
  const { walletAddress, isLoadingUserData } = useProfile();

  // ✅ Esperar a que walletAddress esté disponible
  useEffect(() => {
    const fetchWalletData = async () => {
      // ✅ No ejecutar si aún está cargando
      if (isLoadingUserData || !walletAddress) {
        return;
      }

      try {
        const sellData = {
          kycUrl: "https://example.com/kyc",
          destinationWalletAddress: `ethereum:${walletAddress}`,
          id: "sell123",
          status: parseTransactionStatus("pending"),
        };

        const amountsData = sellRepository.getAmounts();
        const token = tokenRepository.getSelectedToken();

        setWalletData(sellData);
        setAmounts(amountsData);
        setSelectedToken(token);
      } catch (error) {
        console.error("Error fetching wallet data:", error);
      }
    };

    fetchWalletData();
  }, [walletAddress, isLoadingUserData]);

  // Función para generar QR code data
  const generateQRData = () => {
    return `${walletData?.destinationWalletAddress}`;
  };

  const cancelTransaction = async (transactionId: string): Promise<boolean> => {
    setIsCancelLoading(true);
    try {
      const result = await historyRepository.cancelTransaction(transactionId);
      if (result.success) {
        console.log("Transacción cancelada con éxito");
        return true;
      } else {
        console.error("Failed to cancel transaction:", result.error);
        return false;
      }
    } catch (err) {
      console.error("Error cancelling transaction:", err);
      return false;
    } finally {
      setIsCancelLoading(false);
    }
  };

  return {
    walletData,
    amounts,
    selectedToken,
    formattedAddress: formatCryptoAddress(
      walletData?.destinationWalletAddress ?? "",
      "medium",
    ),
    qrData: generateQRData(),
    isCancelLoading,
    cancelTransaction,
  };
};
