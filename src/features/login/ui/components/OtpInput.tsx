import React from 'react';
import { useOtp } from '../hooks/useOtp';

interface OtpInputProps {
    onComplete?: (otp: string) => void;
    className?: string;
    length?: number;
}

const OtpInput: React.FC<OtpInputProps> = ({
    onComplete,
    className = '',
    length = 4,
}) => {
    const {
        otp,
        inputRefs,
        isLoading,
        error,
        handleChange,
        handleKeyDown,
        handlePaste,
        resendCode
    } = useOtp({ length, onComplete });

    const hasError = error && error.trim() !== '';

    return (
        <div className={`w-full ${className}`}>
            {/* Inputs OTP */}
            <div className="flex gap-2 md:gap-3 mb-4">
                {otp.map((digit, index) => (
                    <input
                        key={index}
                        ref={(el) => { inputRefs.current[index] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={handlePaste}
                        disabled={isLoading}
                        className={`
                            w-1/4 h-12 md:h-14 text-lg md:text-xl font-medium text-center border-2 rounded-lg 
                            focus:outline-none focus:ring-2 transition-colors duration-200
                            ${hasError
                                ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                                : 'border-gray-300 focus:ring-[#3E5EF5] focus:border-transparent'
                            }
                            ${isLoading
                                ? 'bg-gray-100 cursor-not-allowed opacity-60'
                                : 'bg-white'
                            }
                        `}
                    />
                ))}
            </div>

            {/* Mensaje de error */}
            {hasError && (
                <div className="mb-4 flex items-center gap-1">
                    <svg
                        className="w-4 h-4 text-red-500 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <p className="text-sm text-red-500">
                        {error}
                    </p>
                </div>
            )}

            {/* Botón reenviar código */}
            <div className="text-center">
                <button
                    onClick={resendCode}
                    disabled={isLoading}
                    className={`
                        text-sm font-medium transition-colors duration-200
                        ${isLoading
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-[#3E5EF5] hover:text-blue-700'
                        }
                    `}
                >
                    {isLoading ? 'Reenviando...' : '¿No recibiste el código? Reenviar'}
                </button>
            </div>

            {/* Indicador de loading */}
            {isLoading && (
                <div className="flex items-center justify-center mt-4">
                    <svg
                        className="animate-spin h-5 w-5 text-[#3E5EF5]"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                    <span className="ml-2 text-sm text-[#3E5EF5]">Verificando...</span>
                </div>
            )}
        </div>
    );
};

export default OtpInput;