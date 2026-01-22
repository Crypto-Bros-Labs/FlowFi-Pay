import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import sellRepository from "../../data/repositories/sellRepository";
import { useNavigate } from "react-router-dom";
import type { BuyInfoData } from "../../../wallet/ui/components/BuyInfoPanel";

export const useDepositInfo = () => {
  // ✅ Obtener el id de la ruta
  const { id } = useParams<{ id: string }>();

  const [isLoadingOrderData, setIsLoadingOrderData] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [buyData, setBuyData] = useState<BuyInfoData | null>(null);

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

        const buyInfoData = await sellRepository.getDepositOrderById(id);

        const buyData: BuyInfoData = {
          amountFiat: buyInfoData.FiatCurrencyAmount,
          amountToken: buyInfoData.cryptoAmount,
          tokenSymbol: buyInfoData.TokenSymbol,
          networkName: buyInfoData.network,
          orderId: buyInfoData.orderUuid,
          id: buyInfoData.transactionId,
          clabe: buyInfoData.capaClabe,
          beneficiaryName: buyInfoData.name,
        };

        setBuyData(buyData);
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

  const onContinue = () => {
    navigate("/main");
  };

  return {
    buyData,
    isLoadingOrderData,
    onContinue,
    error,
    orderId: id,
  };
};
