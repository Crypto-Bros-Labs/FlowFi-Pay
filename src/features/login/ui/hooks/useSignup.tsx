import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import userLocalService from "../../data/local/userLocalService";
import userRepository from "../../data/repositories/userRepository";
import { COUNTRY_CODES } from "../../../../shared/constants/countryCodes";

export const useSignup = () => {
    const [fullname, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [countryCode, setCountryCode] = useState('+52');
    const [isLoading, setIsLoading] = useState(false);
    const [fullnameError, setFullnameError] = useState<string | null>(null);
    const [phoneError, setPhoneError] = useState<string | null>(null);
    const [countryCodeError, setCountryCodeError] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        try {
            const userData = userLocalService.getUserData();
            console.log('🔍 UserData:', userData);

            if (userData && userData.email) {
                setEmail(userData.email);
                console.log('✅ Email loaded:', userData.email);
            } else {
                setEmail('test@example.com');
            }
        } catch (error) {
            console.error('Error loading user data:', error);
            setEmail('');
        }
    }, []);

    const handleFullnameChange = (value: string) => {
        setFullname(value);
        if (fullnameError) setFullnameError(null);
        if (error) setError(null);
    };

    const handleEmailChange = (value: string) => {
        setEmail(value);
    };

    const handlePhoneChange = (value: string) => {
        // Solo permitir números y limitar longitud según el país
        const numericValue = value.replace(/\D/g, '');
        const countryInfo = COUNTRY_CODES[countryCode as keyof typeof COUNTRY_CODES];

        if (countryInfo && numericValue.length <= countryInfo.maxLength) {
            setPhone(numericValue);
        }

        if (phoneError) setPhoneError(null);
        if (error) setError(null);
    };

    const handleCountryCodeChange = (value: string) => {
        setCountryCode(value);
        // Limpiar teléfono al cambiar código de país
        setPhone('');
        if (countryCodeError) setCountryCodeError(null);
        if (phoneError) setPhoneError(null);
        if (error) setError(null);
    };

    const validateFullname = (name: string): boolean => {
        const trimmedName = name.trim();

        // Verificar longitud mínima
        if (trimmedName.length < 2) {
            setFullnameError('El nombre debe tener al menos 2 caracteres');
            return false;
        }

        // Verificar longitud máxima
        if (trimmedName.length > 50) {
            setFullnameError('El nombre no puede tener más de 50 caracteres');
            return false;
        }

        // Verificar que contenga al menos 2 palabras (nombre y apellido)
        const words = trimmedName.split(/\s+/);
        if (words.length < 2) {
            setFullnameError('Por favor ingresa tu nombre y apellido');
            return false;
        }

        // Verificar caracteres válidos (letras, espacios, acentos, ñ, guiones)
        const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑü\s'-]+$/;
        if (!nameRegex.test(trimmedName)) {
            setFullnameError('El nombre solo puede contener letras, espacios y guiones');
            return false;
        }

        // Verificar que cada palabra tenga al menos 1 carácter
        if (words.some(word => word.length < 1)) {
            setFullnameError('Cada nombre debe tener al menos 1 carácter');
            return false;
        }

        setFullnameError(null);
        return true;
    };

    // Validación para teléfonos
    const validatePhone = (phone: string): boolean => {
        const countryInfo = COUNTRY_CODES[countryCode as keyof typeof COUNTRY_CODES];

        if (!countryInfo) {
            setPhoneError('Código de país no soportado');
            return false;
        }

        // Verificar que solo contenga números
        if (!/^\d+$/.test(phone)) {
            setPhoneError('El teléfono solo puede contener números');
            return false;
        }

        // Verificar formato específico del país
        if (!countryInfo.format.test(phone)) {
            setPhoneError(`Formato inválido para ${countryInfo.name}. Debe tener ${countryInfo.maxLength} dígitos`);
            return false;
        }

        setPhoneError(null);
        return true;
    };

    // Validación para código de país
    const validateCountryCode = (code: string): boolean => {
        if (!code || code.trim().length === 0) {
            setCountryCodeError('Selecciona un código de país');
            return false;
        }

        if (!COUNTRY_CODES[code as keyof typeof COUNTRY_CODES]) {
            setCountryCodeError('Código de país no soportado');
            return false;
        }

        setCountryCodeError(null);
        return true;
    };

    const handleUpdateUser = async () => {
        // Validaciones
        if (!validateFullname(fullname)) return;
        if (!validatePhone(phone)) return;
        if (!validateCountryCode(countryCode)) return;

        setIsLoading(true);

        try {
            const userData = userLocalService.getUserData();

            const response = await userRepository.updateUser(
                {
                    userUuid: userData.userUuid || '',
                    phone: `${countryCode}${phone}`,
                    fullName: fullname
                }
            );

            if (response) {
                navigate('/select-token');
            } else {
                setError('Error al crear los datos del usuario');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al crear el usuario');
        } finally {
            setIsLoading(false);
        }
    };

    return {
        fullname,
        email,
        phone,
        countryCode,
        isLoading,
        fullnameError,
        phoneError,
        countryCodeError,
        error,
        handleFullnameChange,
        handleEmailChange,
        handlePhoneChange,
        handleCountryCodeChange,
        handleUpdateUser
    };
}