import { useState, useCallback, useMemo } from "react";
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

  const isOrigin =
    isOriginProp !== undefined ? isOriginProp : params.type === "origin";

  // ✅ Obtener los valores del state si existen
  const [accountOriginId, setAccountOriginId] = useState<string | number>(
    location.state?.accountOriginId || "",
  );

  const [accountOrigin, setAccountOrigin] = useState<string | null>(null);

  const [accountOriginType, setAccountOriginType] = useState<
    "MX" | "US" | null
  >(location.state?.accountOriginType || null);
  const [accountTargetId, setAccountTargetId] = useState<string | number>(
    location.state?.accountTargetId || "",
  );
  const [accountTarget, setAccountTarget] = useState<string | null>(null);

  const title = isOrigin ? "Cuenta origen" : "Cuenta destino";

  const description = isOrigin
    ? "Selecciona la cuenta desde donde se realizará la transferencia. Esta será la cuenta de origen de donde saldrán los fondos."
    : "Selecciona la cuenta destino donde se recibirán los fondos. Esta cuenta recibirá el dinero de la transferencia.";

  // ✅ Determinar qué secciones mostrar
  const showMexicanAccounts = useMemo(() => {
    // Si es origin, mostrar ambas
    if (isOrigin) return true;
    // Si es target y se seleccionó origen mexicano, ocultarlo
    if (accountOriginType === "MX") return false;
    return true;
  }, [isOrigin, accountOriginType]);

  const showUSAccounts = useMemo(() => {
    // Si es origin, mostrar ambas
    if (isOrigin) return true;
    // Si es target y se seleccionó origen estadounidense, ocultarlo
    if (accountOriginType === "US") return false;
    return true;
  }, [isOrigin, accountOriginType]);

  const handleMexicanAccountSelect = useCallback(
    (accountId: string | number, accountName?: string) => {
      if (isOrigin) {
        setAccountOriginId(accountId);
        setAccountOrigin(accountName || null);
        setAccountOriginType("MX");
      } else {
        setAccountTargetId(accountId);
        setAccountTarget(accountName || null);
      }
    },
    [isOrigin],
  );

  const handleUSAccountSelect = useCallback(
    (accountId: string | number, accountName?: string) => {
      if (isOrigin) {
        setAccountOriginId(accountId);
        setAccountOrigin(accountName || null);
        setAccountOriginType("US");
      } else {
        setAccountTargetId(accountId);
        setAccountTarget(accountName || null);
      }
    },
    [isOrigin],
  );

  const selectedAccountId = isOrigin ? accountOriginId : accountTargetId;
  const selectedAccount = isOrigin ? accountOrigin : accountTarget;
  const canContinue = selectedAccountId !== "";

  const handleContinue = useCallback(() => {
    if (canContinue) {
      console.log("Continuar con:", {
        isOrigin,
        accountOriginId,
        accountOriginType,
        accountTargetId,
      });
      if (isOrigin) {
        navigate("/select-account/target", {
          state: {
            accountOriginId,
            accountOriginType,
            accountTargetId: accountTargetId,
          },
          replace: true,
        });
        console.log("Navegando a seleccionar cuenta destino");
      } else {
        navigate("/set-amount-dynamic", {
          state: {
            title: "Cross",
            token: {
              symbol: "USD",
            },
            showSwitchCoin: false,
            typeTransaction: "cross",
            accountOriginId,
            accountTargetId,
            targetCountry: accountOriginType === "MX" ? "US" : "MX",
          },
          replace: true,
        });

        console.log("Navegando a establecer monto");
      }
    }
  }, [
    canContinue,
    isOrigin,
    accountOriginId,
    accountOriginType,
    accountTargetId,
    navigate,
  ]);

  return {
    title,
    description,
    accountOriginId,
    accountOriginType,
    accountTargetId,
    selectedAccountId,
    selectedAccount,
    handleMexicanAccountSelect,
    handleUSAccountSelect,
    handleContinue,
    canContinue,
    showMexicanAccounts,
    showUSAccounts,
  };
};
