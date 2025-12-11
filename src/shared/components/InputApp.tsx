import React from 'react';
import { BiQrScan } from 'react-icons/bi';

interface InputAppProps {
    type?: string;
    placeholder?: string;
    label?: string;
    showLabel?: boolean;
    id?: string;
    name?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onScanQR?: () => void;
    className?: string;
    error?: string | null;
    disabled?: boolean;
}

const InputApp: React.FC<InputAppProps> = ({
    type = 'text',
    placeholder = '',
    label = '',
    showLabel = true,
    id,
    name,
    value,
    onChange,
    onScanQR,
    className = '',
    error = null,
    disabled = false
}) => {
    const hasError = error && error.trim() !== '';

    return (
        <div className={`w-full ${className}`}>
            {showLabel && label && (
                <div className="flex items-center justify-between mb-1">
                    <label
                        htmlFor={id}
                        className="block text-sm font-medium text-[#020F1E] mb-2"
                    >
                        {label}
                    </label>
                    {onScanQR && (
                        <button
                            onClick={onScanQR}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            title="Escanear QR"
                        >
                            <BiQrScan className="w-5 h-5 text-blue-600" />
                        </button>
                    )}
                </div>
            )}
            <input
                type={type}
                placeholder={placeholder}
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                className={`
                    w-full px-3 md:px-4 py-2 md:py-3 border rounded-lg 
                    focus:outline-none focus:ring-2 text-base
                    placeholder:text-sm
                    transition-colors duration-200
                    ${hasError
                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:ring-[#3E5EF5] focus:border-transparent'
                    }
                    ${disabled
                        ? 'bg-gray-100 cursor-not-allowed opacity-60'
                        : 'bg-white'
                    }
                `}
            />

            {/* Mensaje de error */}
            {hasError && (
                <div className="mt-1 flex items-center gap-1">
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
        </div>
    );
};

export default InputApp;