import { useEffect, useState } from "react";
import { formatCryptoAddress } from "../../../../shared/utils/cryptoUtils";
import historyRepository from "../../../history/data/repositories/historyRepository";
import type {
  Amounts,
  SellData,
} from "../../../charge/data/local/sellLocalService";
import sellRepository from "../../../charge/data/repositories/sellRepository";

interface UseExternalSellInfoProps {
  sellData?: SellData;
}

export const useExternalSellInfo = ({ sellData }: UseExternalSellInfoProps) => {
  const [walletData, setWalletData] = useState<SellData | null>(null);
  const [amounts, setAmounts] = useState<Amounts | null>(null);
  const [isCancelLoading, setIsCancelLoading] = useState<boolean>(false);

  // ✅ Setear walletData cuando se recibe el sellData
  useEffect(() => {
    if (sellData) {
      setWalletData(sellData);
      const amountsData = sellRepository.getAmounts();
      setAmounts(amountsData);
    }
  }, [sellData]);

  // Función para generar QR code data
  const generateQRData = () => {
    return `${walletData?.destinationWalletAddress}`;
  };

  const cancelTransaction = async (transactionId: string): Promise<boolean> => {
    setIsCancelLoading(true);
    try {
      const result = await historyRepository.cancelTransaction(
        transactionId,
        "OFF_RAMP",
      );
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
    formattedAddress: formatCryptoAddress(
      walletData?.destinationWalletAddress ?? "",
      "medium",
    ),
    qrData: generateQRData(),
    isCancelLoading,
    cancelTransaction,
  };
};
