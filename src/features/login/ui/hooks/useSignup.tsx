import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import userLocalService from "../../data/local/userLocalService";
import userRepository from "../../data/repositories/userRepository";
import { COUNTRY_CODES } from "../../../../shared/constants/countryCodes";
import { useProfile } from "../../../profile/ui/hooks/useProfile";

export type AccountType = "individual" | "empresa";

export const useSignup = () => {
  const [accountType, setAccountType] = useState<AccountType>("individual");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+52");
  const [rfc, setRfc] = useState("");
  const [razonSocial, setRazonSocial] = useState("");
  const [nombreComercial, setNombreComercial] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fullnameError, setFullnameError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [countryCodeError, setCountryCodeError] = useState<string | null>(null);
  const [rfcError, setRfcError] = useState<string | null>(null);
  const [razonSocialError, setRazonSocialError] = useState<string | null>(null);
  const [nombreComercialError, setNombreComercialError] = useState<
    string | null
  >(null);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { fullName } = useProfile();

  useEffect(() => {
    try {
      setIsLoading(true);
      const userData = userLocalService.getUserData();
      console.log("🔍 UserData:", userData);

      if (userData && userData.email) {
        setEmail(userData.email);
        setFullname(fullName || "");

        console.log("✅ Email loaded:", userData.email);
      } else {
        setEmail("test@example.com");
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      setEmail("");
    } finally {
      setIsLoading(false);
    }
  }, [fullName]);

  const handleAccountTypeChange = (type: AccountType) => {
    setAccountType(type);
    // Limpiar errores al cambiar tipo de cuenta
    setRfcError(null);
    setRazonSocialError(null);
    setNombreComercialError(null);
    setError(null);
  };

  const handleFullnameChange = (value: string) => {
    setFullname(value);
    if (fullnameError) setFullnameError(null);
    if (error) setError(null);
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
  };

  const handlePhoneChange = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    const countryInfo =
      COUNTRY_CODES[countryCode as keyof typeof COUNTRY_CODES];

    if (countryInfo && numericValue.length <= countryInfo.maxLength) {
      setPhone(numericValue);
    }

    if (phoneError) setPhoneError(null);
    if (error) setError(null);
  };

  const handleCountryCodeChange = (value: string) => {
    setCountryCode(value);
    setPhone("");
    if (countryCodeError) setCountryCodeError(null);
    if (phoneError) setPhoneError(null);
    if (error) setError(null);
  };

  const handleRfcChange = (value: string) => {
    setRfc(value.toUpperCase());
    if (rfcError) setRfcError(null);
    if (error) setError(null);
  };

  const handleRazonSocialChange = (value: string) => {
    setRazonSocial(value);
    if (razonSocialError) setRazonSocialError(null);
    if (error) setError(null);
  };

  const handleNombreComercialChange = (value: string) => {
    setNombreComercial(value);
    if (nombreComercialError) setNombreComercialError(null);
    if (error) setError(null);
  };

  const validateFullname = (name: string): boolean => {
    const trimmedName = name.trim();

    if (trimmedName.length < 2) {
      setFullnameError("El nombre debe tener al menos 2 caracteres");
      return false;
    }

    if (trimmedName.length > 50) {
      setFullnameError("El nombre no puede tener más de 50 caracteres");
      return false;
    }

    const words = trimmedName.split(/\s+/);
    if (words.length < 2) {
      setFullnameError("Por favor ingresa tu nombre y apellido");
      return false;
    }

    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑü\s'-]+$/;
    if (!nameRegex.test(trimmedName)) {
      setFullnameError(
        "El nombre solo puede contener letras, espacios y guiones",
      );
      return false;
    }

    if (words.some((word) => word.length < 1)) {
      setFullnameError("Cada nombre debe tener al menos 1 carácter");
      return false;
    }

    setFullnameError(null);
    return true;
  };

  const validatePhone = (phone: string): boolean => {
    const countryInfo =
      COUNTRY_CODES[countryCode as keyof typeof COUNTRY_CODES];

    if (!countryInfo) {
      setPhoneError("Código de país no soportado");
      return false;
    }

    if (!/^\d+$/.test(phone)) {
      setPhoneError("El teléfono solo puede contener números");
      return false;
    }

    if (!countryInfo.format.test(phone)) {
      setPhoneError(
        `Formato inválido para ${countryInfo.name}. Debe tener ${countryInfo.maxLength} dígitos`,
      );
      return false;
    }

    setPhoneError(null);
    return true;
  };

  const validateCountryCode = (code: string): boolean => {
    if (!code || code.trim().length === 0) {
      setCountryCodeError("Selecciona un código de país");
      return false;
    }

    if (!COUNTRY_CODES[code as keyof typeof COUNTRY_CODES]) {
      setCountryCodeError("Código de país no soportado");
      return false;
    }

    setCountryCodeError(null);
    return true;
  };

  /* const validateRfc = (rfc: string): boolean => {
    const trimmedRfc = rfc.trim();

    if (trimmedRfc.length === 0) {
      setRfcError("El RFC es obligatorio");
      return false;
    }

    // RFC válido: 12 o 13 caracteres alfanuméricos
    if (!/^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/.test(trimmedRfc)) {
      setRfcError("El RFC debe tener un formato válido");
      return false;
    }

    setRfcError(null);
    return true;
  }; */

  const validateRazonSocial = (razon: string): boolean => {
    const trimmedRazon = razon.trim();

    if (trimmedRazon.length === 0) {
      setRazonSocialError("La razón social es obligatoria");
      return false;
    }

    if (trimmedRazon.length < 3) {
      setRazonSocialError("La razón social debe tener al menos 3 caracteres");
      return false;
    }

    if (trimmedRazon.length > 100) {
      setRazonSocialError(
        "La razón social no puede tener más de 100 caracteres",
      );
      return false;
    }

    setRazonSocialError(null);
    return true;
  };

  const validateNombreComercial = (nombre: string): boolean => {
    const trimmedNombre = nombre.trim();

    if (trimmedNombre.length === 0) {
      setNombreComercialError("El nombre comercial es obligatorio");
      return false;
    }

    if (trimmedNombre.length < 3) {
      setNombreComercialError(
        "El nombre comercial debe tener al menos 3 caracteres",
      );
      return false;
    }

    if (trimmedNombre.length > 100) {
      setNombreComercialError(
        "El nombre comercial no puede tener más de 100 caracteres",
      );
      return false;
    }

    setNombreComercialError(null);
    return true;
  };

  const handleUpdateUser = async () => {
    // Validaciones comunes
    if (!validatePhone(phone)) return;
    if (!validateCountryCode(countryCode)) return;

    // Validaciones específicas según tipo de cuenta
    if (accountType === "individual") {
      if (!validateFullname(fullname)) return;
    } else {
      if (!validateRazonSocial(razonSocial)) return;
      if (!validateNombreComercial(nombreComercial)) return;
    }

    setIsLoading(true);

    try {
      const userData = userLocalService.getUserData();

      const response = await userRepository.updateUser({
        userUuid: userData.userUuid || "",
        phone: `${countryCode}${phone}`,
        fullName: fullname,
        image: "",
        type: accountType === "individual" ? "INDIVIDUAL" : "BUSINESS",
        corporateName: accountType === "empresa" ? razonSocial : undefined,
        businessName: accountType === "empresa" ? nombreComercial : undefined,
      });

      if (response) {
        navigate("/main");
      } else {
        setError("Error al crear los datos del usuario");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al crear el usuario",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    accountType,
    fullname,
    email,
    phone,
    countryCode,
    rfc,
    razonSocial,
    nombreComercial,
    isLoading,
    fullnameError,
    phoneError,
    countryCodeError,
    rfcError,
    razonSocialError,
    nombreComercialError,
    error,
    handleAccountTypeChange,
    handleFullnameChange,
    handleEmailChange,
    handlePhoneChange,
    handleCountryCodeChange,
    handleRfcChange,
    handleRazonSocialChange,
    handleNombreComercialChange,
    handleUpdateUser,
  };
};
