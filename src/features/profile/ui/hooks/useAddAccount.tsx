import { useState } from "react";
import * as clabe from "clabe-validator";
import TileApp from "../../../../shared/components/TileApp";
import type { ComboBoxOption } from "../../../../shared/components/ComboBoxApp";
import bankRepository from "../../data/repositories/bankRepository";
import userRepository from "../../../login/data/repositories/userRepository";
import { useNavigate } from "react-router-dom";
import { useDialog } from "../../../../shared/hooks/useDialog";

interface Bank {
  id: string;
  name: string;
  code: string;
}

interface USAAccountData {
  accountNumber: string;
  routingNumber: string;
  firstName: string;
  lastName: string;
  streetLine1: string;
  streetLine2: string;
  city: string;
  state: string;
  postalCode: string;
  accountType: "INDIVIDUAL" | "BUSINESS";
  businessName: string;
}

export const useAddAccount = () => {
  const [accountCountry, setAccountCountry] = useState<"MX" | "US">("MX");

  // Estados para CLABE (México)
  const [clabeValue, setClabeValue] = useState("");
  const [selectedBankId, setSelectedBankId] = useState<string>("");
  const [banks, setBanks] = useState<Bank[]>([]);
  const [autoDetectedBankName, setAutoDetectedBankName] = useState<string>("");

  // Estados para USA
  const [usaAccount, setUsaAccount] = useState<USAAccountData>({
    accountNumber: "",
    routingNumber: "",
    firstName: "",
    lastName: "",
    streetLine1: "",
    streetLine2: "",
    city: "",
    state: "",
    postalCode: "",
    accountType: "INDIVIDUAL",
    businessName: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { showDialog } = useDialog();

  // ========== VALIDACIONES CLABE (MÉXICO) ==========
  const validateClabe = (clabeNumber: string): string => {
    if (!clabeNumber) return "";

    const cleanClabe = clabeNumber.replace(/\D/g, "");

    if (cleanClabe.length === 0) return "";

    if (cleanClabe.length < 18) {
      return "La CLABE debe tener 18 dígitos";
    }

    if (cleanClabe.length > 18) {
      return "La CLABE no puede tener más de 18 dígitos";
    }

    if (!clabe.clabe.validate(cleanClabe)) {
      return "CLABE inválida";
    }

    return "";
  };

  const handleClabeComplete = (completeCLABE: string) => {
    try {
      const clabeTest = clabe.clabe.validate(completeCLABE);
      const bankName = clabeTest.bank || "Banco Desconocido";
      setAutoDetectedBankName(bankName);
    } catch (err) {
      console.error("Error detecting bank:", err);
      setError("No se pudo detectar el banco automáticamente");
    }
  };

  const handleClabeChange = (value: string) => {
    const cleanValue = value.replace(/\D/g, "").substring(0, 18);
    setClabeValue(cleanValue);

    const validationError = validateClabe(cleanValue);
    setError(validationError);

    if (cleanValue.length === 18 && !validationError) {
      handleClabeComplete(cleanValue);
    } else if (cleanValue.length < 18) {
      setSelectedBankId("");
      setAutoDetectedBankName("");
    }
  };

  // ========== VALIDACIONES USA ==========
  const validateUsaAccount = (): Record<string, string> => {
    const newErrors: Record<string, string> = {};

    if (!usaAccount.accountNumber.trim()) {
      newErrors.accountNumber = "El número de cuenta es requerido";
    } else if (!/^\d{1,17}$/.test(usaAccount.accountNumber)) {
      newErrors.accountNumber =
        "El número de cuenta debe contener solo dígitos";
    }

    if (!usaAccount.routingNumber.trim()) {
      newErrors.routingNumber = "El número de ruta es requerido";
    } else if (!/^\d{9}$/.test(usaAccount.routingNumber)) {
      newErrors.routingNumber = "El número de ruta debe tener 9 dígitos";
    }

    if (!usaAccount.firstName.trim()) {
      newErrors.firstName = "El nombre es requerido";
    }

    if (!usaAccount.lastName.trim()) {
      newErrors.lastName = "El apellido es requerido";
    }

    if (!usaAccount.streetLine1.trim()) {
      newErrors.streetLine1 = "La dirección es requerida";
    }

    if (!usaAccount.city.trim()) {
      newErrors.city = "La ciudad es requerida";
    }

    if (!usaAccount.state.trim()) {
      newErrors.state = "El estado es requerido";
    } else if (usaAccount.state.length !== 2) {
      newErrors.state = "El estado debe ser de 2 caracteres (ej: FL)";
    }

    if (!usaAccount.postalCode.trim()) {
      newErrors.postalCode = "El código postal es requerido";
    } else if (!/^\d{5}(-\d{4})?$/.test(usaAccount.postalCode)) {
      newErrors.postalCode =
        "Formato de código postal inválido (ej: 33101 o 33101-1234)";
    }

    if (
      usaAccount.accountType === "BUSINESS" &&
      !usaAccount.businessName.trim()
    ) {
      newErrors.businessName = "El nombre del negocio es requerido";
    }

    return newErrors;
  };

  const handleUsaAccountChange = (
    field: keyof USAAccountData,
    value: string,
  ) => {
    setUsaAccount((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Limpiar error del campo cuando el usuario comienza a escribir
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  // ========== COMBOBOX PARA BANCOS MÉXICO ==========
  const bankOptions: ComboBoxOption[] = banks.map((bank) => ({
    id: bank.id,
    component: <TileApp title={bank.name} />,
  }));

  const selectedBankComponent = () => {
    const selectedBank = banks.find((bank) => bank.id === selectedBankId);

    if (!selectedBank && autoDetectedBankName) {
      return (
        <TileApp
          title={autoDetectedBankName}
          titleClassName="text-sm font-medium text-gray-900"
        />
      );
    }

    if (!selectedBank) {
      return <span className="text-gray-500">Completa tu CLABE</span>;
    }

    return (
      <TileApp
        title={autoDetectedBankName}
        titleClassName="text-sm font-medium text-gray-900"
      />
    );
  };

  const handleBankSelect = (option: ComboBoxOption) => {
    setSelectedBankId(option.id as string);
    setAutoDetectedBankName("");
  };

  // ========== SUBMIT ==========
  const handleAddAccount = async () => {
    setIsLoading(true);
    setError("");
    setErrors({});

    try {
      if (accountCountry === "MX") {
        // Validar México
        const validationError = validateClabe(clabeValue);
        if (validationError) {
          setError(validationError);
          setIsLoading(false);
          return;
        }

        if (!selectedBankId && !autoDetectedBankName) {
          setError("Selecciona un banco");
          setIsLoading(false);
          return;
        }

        const userUuid =
          (await userRepository.getCurrentUserData())?.userUuid ||
          "default-uuid";
        const response = await bankRepository.addBankAccount({
          userUuid,
          clabe: clabeValue,
          bankName: autoDetectedBankName,
          country: "MX",
        });

        if (response.success && response.data) {
          showDialog({
            title: "Cuenta Agregada",
            subtitle: `Cuenta de ${autoDetectedBankName} agregada exitosamente`,
            onNext: () => navigate("/main"),
            onBack: () => navigate("/main"),
            hideBack: true,
          });

          setClabeValue("");
          setSelectedBankId("");
          setAutoDetectedBankName("");
          setError("");
        } else {
          setError(response.error || "Error al agregar la cuenta");
          return;
        }
      } else {
        // Validar USA
        const validationErrors = validateUsaAccount();
        if (Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors);
          setIsLoading(false);
          return;
        }

        const userUuid =
          (await userRepository.getCurrentUserData())?.userUuid ||
          "default-uuid";
        const response = await bankRepository.addBankAccount({
          userUuid,
          // TODO adaptar datos de USA al formato que espera el backend
          clabe: clabeValue,
          bankName: autoDetectedBankName,
          country: "MX",
        });

        if (response.success && response.data) {
          showDialog({
            title: "Cuenta Agregada",
            subtitle: `Cuenta bancaria USA agregada exitosamente`,
            onNext: () => navigate("/main"),
            onBack: () => navigate("/main"),
            hideBack: true,
          });

          setUsaAccount({
            accountNumber: "",
            routingNumber: "",
            firstName: "",
            lastName: "",
            streetLine1: "",
            streetLine2: "",
            city: "",
            state: "",
            postalCode: "",
            accountType: "INDIVIDUAL",
            businessName: "",
          });
        } else {
          setError(response.error || "Error al agregar la cuenta");
          return;
        }
      }
    } catch (err) {
      setError("Error al agregar la cuenta. Intenta nuevamente.");
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // ========== COMPUTED VALUES ==========
  const formattedClabe = clabeValue.replace(/(\d{4})(?=\d)/g, "$1 ");

  const isFormValid =
    accountCountry === "MX"
      ? clabeValue.length === 18 &&
        !error &&
        (selectedBankId || autoDetectedBankName)
      : Object.keys(errors).length === 0 &&
        usaAccount.accountNumber &&
        usaAccount.routingNumber &&
        usaAccount.firstName &&
        usaAccount.lastName &&
        usaAccount.streetLine1 &&
        usaAccount.city &&
        usaAccount.state &&
        usaAccount.postalCode &&
        (usaAccount.accountType === "INDIVIDUAL" ||
          (usaAccount.accountType === "BUSINESS" && usaAccount.businessName));

  return {
    // Country selection
    accountCountry,
    setAccountCountry,

    // México
    clabe: clabeValue,
    formattedClabe,
    handleClabeChange,
    selectedBankId,
    bankOptions,
    selectedBankComponent: selectedBankComponent(),
    handleBankSelect,

    // USA
    usaAccount,
    handleUsaAccountChange,
    errors,

    // General
    handleAddAccount,
    isLoading,
    error,
    isFormValid,
    setBanks,
    autoDetectedBankName,
  };
};
