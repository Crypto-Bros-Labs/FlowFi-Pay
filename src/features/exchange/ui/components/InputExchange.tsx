import React, { useState } from 'react';
import { IoChevronDown } from 'react-icons/io5';

interface InputExchangeProps {
    symbol: string;
    icon?: React.ReactNode;
    value: string;
    onChange: (value: string) => void;
    onSelectToken: () => void;
    placeholder?: string;
    className?: string;
}

const InputExchange: React.FC<InputExchangeProps> = ({
    symbol,
    icon,
    value,
    onChange,
    onSelectToken,
    placeholder = "0.00",
    className = ''
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasBeenFocused, setHasBeenFocused] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let inputValue = e.target.value;

        // Remover comas para validación
        inputValue = inputValue.replace(/,/g, '');

        // Solo permitir números y un punto decimal
        if (/^\d*\.?\d*$/.test(inputValue)) {
            // Prevenir ceros a la izquierda (excepto 0 solo o 0.)
            if (inputValue.length > 1 && inputValue.startsWith('0') && !inputValue.startsWith('0.')) {
                inputValue = inputValue.replace(/^0+/, '');
                if (inputValue === '') inputValue = '0';
            }

            // Si está vacío después de la limpieza, permitir que esté vacío
            onChange(inputValue);
        }
    };

    const handleFocus = () => {
        setIsFocused(true);
        if (!hasBeenFocused) {
            setHasBeenFocused(true);
            // Si el valor es "0" (sin decimales), limpiar al hacer focus
            if (value === '0.00' || value === '') {
                onChange('');
            }
        }
    };

    const handleBlur = () => {
        setIsFocused(false);
        // Si está vacío al perder focus, volver a "0"
        if (!value || value === '') {
            onChange('0');
        }
    };

    const formatDisplayValue = (val: string) => {
        // Si no hay valor y no está enfocado, mostrar 0.00
        if ((!val || val === '') && !isFocused) {
            return hasBeenFocused ? '0' : '0.00';
        }

        // Si está enfocado y vacío, no mostrar nada
        if ((!val || val === '') && isFocused) {
            return '';
        }

        const parts = val.split('.');
        const integerPart = parts[0];
        const decimalPart = parts[1];

        // Agregar comas cada 3 dígitos
        const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

        // Si hay parte decimal, agregarla
        if (decimalPart !== undefined) {
            return `${formattedInteger}.${decimalPart}`;
        }

        return formattedInteger;
    };

    const displayValue = formatDisplayValue(value);

    return (
        <div className={`w-full bg-[#D6E6F8] border border-[#666666] rounded-[15px] p-3 flex items-center justify-between ${className}`}>
            {/* Token selector button */}
            <button
                onClick={onSelectToken}
                className="flex items-center gap-1 bg-white rounded-lg px-2 py-1 hover:bg-gray-50 transition-colors duration-200 flex-shrink-0"
            >
                {/* Icon/Image */}
                {icon && (
                    <div className="w-5 h-5 flex-shrink-0">
                        {icon}
                    </div>
                )}

                {/* Symbol */}
                <span className="font-medium text-sm text-[#020F1E] whitespace-nowrap">
                    {symbol}
                </span>

                {/* Chevron */}
                <IoChevronDown size={16} className="text-[#666666]" />
            </button>

            {/* Amount input */}
            <input
                type="text"
                inputMode="decimal"
                value={displayValue}
                onChange={handleInputChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder={placeholder}
                className="bg-transparent text-right text-2xl font-semibold text-[#020F1E] placeholder:text-[#666666] focus:outline-none flex-1 min-w-0 ml-2 truncate"
            />
        </div>
    );
};

export default InputExchange;