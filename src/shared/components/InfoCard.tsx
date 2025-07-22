import React from 'react';

interface InfoCardProps {
    title: string;
    subtitle?: string;
    trailingIcon?: React.ReactNode;
    onTap?: () => void;
    onIconTap?: () => void;
    className?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({
    title,
    subtitle,
    trailingIcon,
    onTap,
    onIconTap,
    className = ""
}) => {
    return (
        <div
            onClick={onTap}
            className={`
                w-full p-4 bg-white border border-[#E5E7EB] rounded-[12px]
                transition-all duration-200 ease-in-out
                ${onTap ? 'hover:bg-gray-50 cursor-pointer' : ''}
                ${className}
            `}
        >
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <h3 className="text-sm font-bold text-[#020F1E] mb-1">
                        {title}
                    </h3>
                    {subtitle && (
                        <p className="text-sm font-medium text-[#666666]">
                            {subtitle}
                        </p>
                    )}
                </div>

                {trailingIcon && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onIconTap?.();
                        }}
                        className="ml-3 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    >
                        {trailingIcon}
                    </button>
                )}
            </div>
        </div>
    );
};

export default InfoCard;