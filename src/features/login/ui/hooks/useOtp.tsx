import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authRepository from '../../data/repositories/authRepository';
import userLocalService from '../../data/local/userLocalService';

interface UseOtpProps {
    length?: number;
    onComplete?: (otp: string) => void;
}

export const useOtp = ({ length = 4, onComplete }: UseOtpProps = {}) => {
    //input state
    const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Loading y error states
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Email state
    const email = userLocalService.getUserData().email || '';

    const navigate = useNavigate();

    //input handlers
    const handleChange = (index: number, value: string) => {

        if (error) setError(null);

        // Solo permitir números
        if (value && !/^\d$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Mover al siguiente input si hay un valor
        if (value && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }

        // Llamar onComplete cuando todos los campos estén llenos
        if (newOtp.every(digit => digit !== '') && onComplete) {
            onComplete(newOtp.join(''));
        }

        if (newOtp.every(digit => digit !== '')) {
            handleLogin(newOtp.join(''));
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {

        if (error) setError(null);

        // Mover al input anterior con backspace
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }

        // Mover al siguiente input con la flecha derecha
        if (e.key === 'ArrowRight' && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }

        // Mover al input anterior con la flecha izquierda
        if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {

        e.preventDefault();

        if (error) setError(null);

        const pastedData = e.clipboardData.getData('text');
        const digits = pastedData.replace(/\D/g, '').slice(0, length).split('');

        const newOtp = [...otp];
        digits.forEach((digit, index) => {
            if (index < length) {
                newOtp[index] = digit;
            }
        });

        setOtp(newOtp);

        // Enfocar el último input lleno o el siguiente vacío
        const nextIndex = Math.min(digits.length, length - 1);
        inputRefs.current[nextIndex]?.focus();

        // Llamar onComplete si se pegaron todos los dígitos
        if (digits.length === length && onComplete) {
            onComplete(newOtp.join(''));
        }

        // Auto-login si se pegó el código completo
        if (digits.length === length) {
            handleLogin(newOtp.join(''));
        }
    };

    const clearOtp = () => {
        setOtp(Array(length).fill(''));
        inputRefs.current[0]?.focus();
        setError(null);
    };

    // Login handlers 
    const handleLogin = async (code?: string) => {
        const otpCode = code || otp.join('');

        // Validaciones
        if (otpCode.length !== length) {
            setError('Por favor ingresa el código completo');
            return;
        }

        if (email.trim() === '') {
            setError('Email no encontrado. Por favor inicia sesión nuevamente.');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const success = await authRepository.login(email, otpCode);

            if (success) {
                // Verificar si el usuario tiene todos los datos
                const userData = userLocalService.getUserData();

                if (userData.hasAllData) {
                    navigate('/select-token');
                } else {
                    navigate('/signup');
                }
            } else {
                setError('Código incorrecto. Inténtalo de nuevo.');
                clearOtp();
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al verificar el código');
            clearOtp();
        } finally {
            setIsLoading(false);
        }
    };

    const resendCode = async () => {
        if (email.trim() === '') {
            setError('Email no encontrado');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const success = await authRepository.getAuthData(email);
            if (success) {
                clearOtp();
                // Aquí podrías mostrar un mensaje de éxito
            } else {
                setError('Error al reenviar el código');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al reenviar el código');
        } finally {
            setIsLoading(false);
        }
    };

    return {
        otp,
        inputRefs,
        isLoading,
        error,
        handleChange,
        handleKeyDown,
        handlePaste,
        handleLogin,
        clearOtp,
        resendCode
    };
};