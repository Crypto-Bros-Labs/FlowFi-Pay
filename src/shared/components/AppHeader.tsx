import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { IconType } from 'react-icons';
import { IoChevronBack } from 'react-icons/io5';

interface HeaderAction {
    icon: IconType;
    onClick: () => void;
    className?: string;
}

interface AppHeaderProps {
    title?: string;
    showBackButton?: boolean;
    onBack?: () => void;
    leftActions?: HeaderAction[];
    rightActions?: HeaderAction[];
}

const AppHeader: React.FC<AppHeaderProps> = ({
    title,
    showBackButton = true,
    onBack,
    leftActions,
    rightActions = []
}) => {
    const navigate = useNavigate();

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigate(-1);
        }
    };

    // Si hay leftActions, no mostrar el botón de back
    const shouldShowBackButton = showBackButton && !leftActions;

    return (
        <div className="flex items-center justify-between p-4">
            {/* Lado izquierdo - Siempre ocupa espacio */}
            <div className="flex items-center w-10">
                {shouldShowBackButton && (
                    <button
                        onClick={handleBack}
                        className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <IoChevronBack className="w-6 h-6 text-gray-700" />
                    </button>
                )}
                <div className='flex items-center gap-2 w-10 justify-start'>
                    {leftActions && (
                        leftActions.map((action, index) => (
                            <button
                                key={index}
                                onClick={action.onClick}
                                className={`p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors ${action.className || ''}`}
                            >
                                <action.icon className="w-6 h-6" />
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Título centrado */}
            {title && (
                <h1 className="text-lg font-semibold text-center flex-1 mx-4 text-gray-900">{title}</h1>
            )}

            {/* Lado derecho - Siempre ocupa el mismo espacio */}
            <div className="flex items-center gap-2 w-10 justify-end">
                {rightActions.map((action, index) => (
                    <button
                        key={index}
                        onClick={action.onClick}
                        className={`p-2 hover:bg-gray-100 rounded-full transition-colors ${action.className || ''}`}
                    >
                        <action.icon className="w-6 h-6" />
                    </button>
                ))}
            </div>
        </div>
    );
};

export default AppHeader;