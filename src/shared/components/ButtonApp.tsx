import React from 'react';

interface ButtonAppProps {
    text: string;
    paddingVertical?: string;
    paddingHorizontal?: string;
    backgroundColor?: string;
    stroke?: boolean;
    textColor?: string;
    onClick?: () => void;
    borderRadius?: string;
    isMobile?: boolean;
    textSize?: string;
    disabled?: boolean;
    loading?: boolean;
    loadingText?: string;
}

const ButtonApp: React.FC<ButtonAppProps> = ({
    text,
    paddingVertical = 'py-3',
    paddingHorizontal = 'px-6',
    backgroundColor = 'bg-[#3E5EF5]',
    stroke = false,
    textColor = 'text-white',
    onClick,
    borderRadius = 'rounded-[3.125rem]',
    isMobile = false,
    textSize = 'text-base',
    disabled = false,
    loading = false,
    loadingText = 'Cargando...',
}) => {
    const isDisabled = disabled || loading;
    const strokeClass = stroke ? `border-2 border-current` : '';
    const cursorClass = isDisabled ? 'cursor-not-allowed' : 'cursor-pointer';
    const widthClass = isMobile ? 'w-full' : '';

    // Clases de estado
    const disabledClasses = isDisabled
        ? 'opacity-50 cursor-not-allowed'
        : 'hover:opacity-90 active:scale-95';


    return (
        <button

            className={`
                ${paddingVertical} 
                ${paddingHorizontal} 
                ${textColor} 
                ${backgroundColor}
                ${borderRadius} 
                ${strokeClass} 
                ${cursorClass}
                ${widthClass}
                ${textSize}
                font-medium 
                transition-all 
                duration-200 
                ${disabledClasses}
                flex items-center justify-center gap-2
            `}
            onClick={!isDisabled && onClick ? onClick : () => { }}
            disabled={isDisabled}
        >
            {/* Spinner de carga */}
            {loading && (
                <svg
                    className="animate-spin h-4 w-4"
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
            )}

            {/* Texto del botón */}
            <span>
                {loading ? loadingText : text}
            </span>
        </button>
    );
};

export default ButtonApp;