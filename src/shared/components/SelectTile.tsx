import React from 'react';
import { IoCheckmarkCircle } from 'react-icons/io5';

interface SelectTileProps {
    leading?: React.ReactNode;
    title: React.ReactNode;
    subtitle?: React.ReactNode;
    checked?: boolean;
    onClick?: () => void;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'default' | 'card' | 'compact';
    disabled?: boolean;
}

const SelectTile: React.FC<SelectTileProps> = ({
    leading,
    title,
    subtitle,
    checked = false,
    onClick,
    className = '',
    size = 'md',
    variant = 'default',
    disabled = false
}) => {
    // Responsive padding based on size
    const paddingClasses = {
        sm: 'p-2 sm:p-3',
        md: 'p-3 sm:p-4',
        lg: 'p-4 sm:p-5'
    };

    // Responsive gap based on size
    const gapClasses = {
        sm: 'gap-2 sm:gap-3',
        md: 'gap-3 sm:gap-4',
        lg: 'gap-4 sm:gap-5'
    };

    // Responsive text sizing
    const textClasses = {
        sm: 'text-sm sm:text-base',
        md: 'text-base sm:text-lg',
        lg: 'text-lg sm:text-xl'
    };

    // Icon sizing based on screen and size
    const iconSizes = {
        sm: { mobile: 20, desktop: 24 },
        md: { mobile: 24, desktop: 30 },
        lg: { mobile: 28, desktop: 36 }
    };

    // Variant-specific styles
    const variantClasses = {
        default: 'rounded-[10px] sm:rounded-[15px]',
        card: 'rounded-[12px] sm:rounded-[20px] shadow-sm hover:shadow-md',
        compact: 'rounded-[8px] sm:rounded-[12px]'
    };

    // Responsive layout direction for mobile
    const layoutClasses = variant === 'compact'
        ? 'flex-col sm:flex-row items-start sm:items-center'
        : 'flex-row items-center';

    return (
        <div
            onClick={disabled ? undefined : onClick}
            className={`
                flex ${layoutClasses} justify-between 
                ${paddingClasses[size]} ${variantClasses[variant]}
                border transition-all duration-200 
                ${disabled
                    ? 'opacity-50 cursor-not-allowed'
                    : 'cursor-pointer'
                }
                ${checked
                    ? 'bg-[#3E5EF5] border-[#3E5EF5] text-white'
                    : 'bg-white border-gray-300 text-gray-800 hover:border-gray-400 active:border-gray-500'
                }
                ${!disabled && 'hover:scale-[1.02] active:scale-[0.98]'}
                focus:outline-none focus:ring-2 focus:ring-[#3E5EF5] focus:ring-opacity-50
                ${className}
            `}
            tabIndex={disabled ? -1 : 0}
            onKeyDown={(e) => {
                if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    onClick?.();
                }
            }}
            role="button"
            aria-pressed={checked}
            aria-disabled={disabled}
        >
            {/* Left side - Leading icon y content */}
            <div className={`flex items-center ${gapClasses[size]} flex-1 min-w-0`}>
                {leading && (
                    <div className={`
                        flex-shrink-0 transition-colors duration-200
                        ${checked ? 'text-white' : 'text-gray-600'}
                    `}>
                        {leading}
                    </div>
                )}

                {/* Content container */}
                <div className="flex-1 min-w-0">
                    <div className={`
                        ${textClasses[size]} font-medium transition-colors duration-200
                        ${checked ? 'text-white' : 'text-gray-800'}
                        truncate sm:whitespace-normal
                    `}>
                        {title}
                    </div>

                    {subtitle && (
                        <div className={`
                            text-xs sm:text-sm mt-1 transition-colors duration-200
                            ${checked ? 'text-blue-100' : 'text-gray-500'}
                            truncate sm:whitespace-normal
                        `}>
                            {subtitle}
                        </div>
                    )}
                </div>
            </div>

            {/* Right side - Check icon */}
            {checked && (
                <div className={`
                    flex-shrink-0 text-white transition-transform duration-200
                    ${variant === 'compact' ? 'mt-2 sm:mt-0 self-start sm:self-center' : ''}
                `}>
                    <IoCheckmarkCircle
                        size={window.innerWidth < 640 ? iconSizes[size].mobile : iconSizes[size].desktop}
                        className="animate-pulse"
                    />
                </div>
            )}
        </div>
    );
};

export default SelectTile;