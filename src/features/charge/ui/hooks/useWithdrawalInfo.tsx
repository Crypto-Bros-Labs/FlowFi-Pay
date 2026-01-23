import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { formatCryptoAddress } from "../../../../shared/utils/cryptoUtils";
import type { Amounts, SellData } from "../../data/local/sellLocalService";
import sellRepository from "../../data/repositories/sellRepository";
import { useNavigate } from "react-router-dom";
import { parseTransactionStatus } from "../../../../shared/utils/historyUtils";

export const useWithdrawalInfoPage = () => {
  // ✅ Obtener el id de la ruta
  const { id } = useParams<{ id: string }>();

  const [walletData, setWalletData] = useState<SellData | null>(null);
  const [amounts, setAmounts] = useState<Amounts | null>(null);
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [networkName, setNetworkName] = useState<string | null>(null);
  const [isLoadingOrderData, setIsLoadingOrderData] = useState<boolean>(true);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  // ✅ Esperar a que walletAddress esté disponible y usar el id de la ruta
  useEffect(() => {
    const fetchWalletData = async () => {
      setIsLoadingOrderData(true);
      setError(null);

      try {
        if (!id) {
          setError("ID de orden no disponible");
          setIsLoadingOrderData(false);
          return;
        }

        const sellInfoData = await sellRepository.getWithdrawalOrderById(id);

        const sellData = {
          kycUrl: "https://example.com/kyc",
          destinationWalletAddress: `ethereum:${sellInfoData.capaWallet}`,
          id: id,
          status: parseTransactionStatus(sellInfoData.status || "pending"),
        };

        const amountsData = {
          amountFiat: sellInfoData.FiatCurrencyAmount,
          amountToken: sellInfoData.cryptoAmount,
        };
        const token = sellInfoData.TokenSymbol;
        const network = sellInfoData.network;

        setWalletData(sellData);
        setAmounts(amountsData);
        setSelectedToken(token);
        setNetworkName(network);
        setWalletAddress(sellInfoData.capaWallet);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Error al cargar la orden";
        setError(errorMessage);
        console.error("Error fetching wallet data:", error);
      } finally {
        setIsLoadingOrderData(false);
      }
    };

    fetchWalletData();
  }, [id]); // ✅ Agregar id como dependencia

  // Función para generar QR code data
  const generateQRData = () => {
    return `${walletData?.destinationWalletAddress}`;
  };

  const onContinue = () => {
    navigate("/main");
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
    isLoadingOrderData,
    walletAddress,
    onContinue,
    networkName,
    error,
    orderId: id,
  };
};
