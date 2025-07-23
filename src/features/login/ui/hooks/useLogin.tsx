import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authRepository from '../../data/repositories/authRepository';

export const useLogin = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    const handleEmailChange = (value: string) => {
        setEmail(value);
        if (error) setError(null);
    };

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleLogin = async () => {
        // Validaciones
        if (!email.trim()) {
            setError('El correo electrónico es requerido');
            return;
        }

        if (!validateEmail(email)) {
            setError('Por favor ingresa un correo electrónico válido');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {

            const response = await authRepository.getAuthData(email)

            if (response) {
                // Navegar al OTP o dashboard según el flujo
                navigate('/otp');
            } else {
                setError('Error inesperado al iniciar sesión');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
        } finally {
            setIsLoading(false);
        }
    };

    return {
        email,
        isLoading,
        error,
        handleEmailChange,
        handleLogin,
    };
};