import React from "react";
import { useNavigate } from "react-router-dom";

interface HeaderModalProps {
    isModal?: boolean;
    isFlow?: boolean;
    onBack?: () => void;
    onClose?: () => void;
}

const HeaderModal: React.FC<HeaderModalProps> = ({
    isModal = false,
    isFlow = false,
    onBack,
    onClose
}) => {
    const navigate = useNavigate();

    // Función por defecto para onBack
    const defaultOnBack = () => {
        navigate(-1);
    };

    // Usar onBack pasado como prop o la función por defecto
    const handleBack = onBack || defaultOnBack;

    return (
        <>
            {isFlow && (
                <div className="flex justify-between items-center mb-3">
                    <button
                        onClick={handleBack}
                        className="hover:bg-gray-100 rounded-full p-1 transition-colors"
                    >
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    {isModal && (
                        <button
                            onClick={onClose}
                            className="hover:bg-gray-100 rounded-full p-1 transition-colors"
                        >
                            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}

                    {!isModal && <div className="w-10 h-10"></div>}
                </div>
            )}

            {/* Solo modal (sin flow) */}
            {!isFlow && isModal && (
                <div className="flex justify-end items-center mb-3">
                    <button
                        onClick={onClose}
                        className="hover:bg-gray-100 rounded-full p-1 transition-colors"
                    >
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            )}

            {/* Ni flow ni modal */}
            {!isFlow && !isModal && (
                <div className="w-10 h-5"></div>
            )}
        </>
    );
};

export default HeaderModal;