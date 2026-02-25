import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import sellRepository from "../../data/repositories/sellRepository";
import { useNavigate } from "react-router-dom";
import type { CrossRampInfoData } from "../../../wallet/ui/components/CrossInfoPanel";
import { parseTransactionStatus } from "../../../../shared/utils/historyUtils";

export const useCrossInfoPage = () => {
  // ✅ Obtener el id de la ruta
  const { id } = useParams<{ id: string }>();

  const [isLoadingOrderData, setIsLoadingOrderData] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [crossRampData, setCrossRampData] = useState<CrossRampInfoData | null>(
    null,
  );

  const navigate = useNavigate();

  // ✅ Fetch cross ramp order data
  useEffect(() => {
    const fetchCrossRampData = async () => {
      setIsLoadingOrderData(true);
      setError(null);

      try {
        if (!id) {
          setError("ID de orden no disponible");
          setIsLoadingOrderData(false);
          return;
        }

        const crossRampOrderData =
          await sellRepository.getCrossRampOrderById(id);

        const crossData: CrossRampInfoData = {
          amountSource: crossRampOrderData.sourceAmount,
          amountTarget: crossRampOrderData.targetAmount,
          countryTarget: crossRampOrderData.targetCountry as "MX" | "US",
          orderId: crossRampOrderData.orderUuid,
          id: crossRampOrderData.transactionId,
          accountIdentifier: crossRampOrderData.accountIdentifier,
          beneficiaryName: crossRampOrderData.beneficiaryName,
          bankName: crossRampOrderData.sourceBankName,
          concept: crossRampOrderData.concept,
          status: parseTransactionStatus(
            crossRampOrderData.status || "pending",
          ),
        };

        setCrossRampData(crossData);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Error al cargar la orden";
        setError(errorMessage);
        console.error("Error fetching cross ramp data:", error);
      } finally {
        setIsLoadingOrderData(false);
      }
    };

    fetchCrossRampData();
  }, [id]); // ✅ Agregar id como dependencia

  const onContinue = () => {
    navigate("/main");
  };

  return {
    crossRampData,
    isLoadingOrderData,
    onContinue,
    error,
    orderId: id,
  };
};
