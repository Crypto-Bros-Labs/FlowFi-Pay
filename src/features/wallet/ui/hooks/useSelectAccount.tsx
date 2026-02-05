import { useState, useCallback } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";

interface UseSelectAccountProps {
  isOrigin?: boolean;
}

export const useSelectAccount = ({
  isOrigin: isOriginProp,
}: UseSelectAccountProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ type?: "origin" | "target" }>();

  // ✅ Determinar isOrigin desde parámetros o props
  const isOrigin =
    isOriginProp !== undefined ? isOriginProp : params.type === "origin";

  // ✅ Obtener los valores del state si existen
  const [accountOriginId, setAccountOriginId] = useState<string | number>(
    location.state?.accountOriginId || "",
  );
  const [accountTargetId, setAccountTargetId] = useState<string | number>(
    location.state?.accountTargetId || "",
  );

  const title = isOrigin ? "Cuenta origen" : "Cuenta destino";

  const description = isOrigin
    ? "Selecciona la cuenta desde donde se realizará la transferencia. Esta será la cuenta de origen de donde saldrán los fondos."
    : "Selecciona la cuenta destino donde se recibirán los fondos. Esta cuenta recibirá el dinero de la transferencia.";

  const handleMexicanAccountSelect = useCallback(
    (accountId: string | number) => {
      if (isOrigin) {
        setAccountOriginId(accountId);
      } else {
        setAccountTargetId(accountId);
      }
    },
    [isOrigin],
  );

  const handleUSAccountSelect = useCallback(
    (accountId: string | number) => {
      if (isOrigin) {
        setAccountOriginId(accountId);
      } else {
        setAccountTargetId(accountId);
      }
    },
    [isOrigin],
  );

  const selectedAccountId = isOrigin ? accountOriginId : accountTargetId;
  const canContinue = selectedAccountId !== "";

  const handleContinue = useCallback(() => {
    if (canContinue) {
      console.log("Continuar con:", {
        isOrigin,
        accountOriginId,
        accountTargetId,
      });
      if (isOrigin) {
        // ✅ Navegar a /select-account/target con el accountOriginId guardado
        navigate("/select-account/target", {
          state: {
            accountOriginId,
            accountTargetId: accountTargetId,
          },
          replace: true,
        });
        console.log("Navegando a seleccionar cuenta destino");
      } else {
        // ✅ Navegar a la siguiente página
        navigate("/set-amount-dynamic", {
          state: {
            title: "Cross",
            token: {
              symbol: "USD",
            },
            showSwitchCoin: true,
            typeTransaction: "cross",
            accountOriginId,
            accountTargetId,
          },
          replace: true,
        });

        console.log("Navegando a establecer monto");
      }
    }
  }, [canContinue, isOrigin, accountOriginId, accountTargetId, navigate]);

  return {
    title,
    description,
    accountOriginId,
    accountTargetId,
    selectedAccountId,
    handleMexicanAccountSelect,
    handleUSAccountSelect,
    handleContinue,
    canContinue,
  };
};
