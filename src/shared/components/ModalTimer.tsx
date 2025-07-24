import React, { useState, useEffect } from 'react';

interface ModalTimerProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    message?: string;
    duration?: number; // duración en segundos
    onComplete?: () => void;
}

const ModalTimer: React.FC<ModalTimerProps> = ({
    isOpen,
    onClose,
    title = "Validando tu cuenta",
    message = "Por favor espera un momento, estamos validando tu información",
    duration = 60, // 1 minuto por defecto
    onComplete
}) => {
    const [timeLeft, setTimeLeft] = useState(duration);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (!isOpen) {
            setTimeLeft(duration);
            setProgress(0);
            return;
        }

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                const newTime = prev - 1;
                const newProgress = ((duration - newTime) / duration) * 100;
                setProgress(newProgress);

                if (newTime <= 0) {
                    clearInterval(interval);
                    onComplete?.();
                    return 0;
                }
                return newTime;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isOpen, duration, onComplete]);

    // ✅ Calcular tonos de azul basado en el progreso
    const getSpinnerColor = () => {
        if (progress <= 33) return 'text-blue-300'; // Azul claro al inicio
        if (progress <= 66) return 'text-blue-500'; // Azul medio
        return 'text-blue-600'; // Azul oscuro al final
    };

    // ✅ Color de la barra de progreso con tonos azules
    const getProgressBarColor = () => {
        if (progress <= 33) return 'bg-blue-300';
        if (progress <= 66) return 'bg-blue-500';
        return 'bg-blue-600';
    };

    // Formatear tiempo restante
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity" />

            {/* Modal */}
            <div className="relative bg-white rounded-xl shadow-xl max-w-sm w-full mx-4 p-6">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Content */}
                <div className="text-center">
                    {/* Spinner with Progress */}
                    <div className="relative w-24 h-24 mx-auto mb-6">
                        {/* Background Circle */}
                        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="none"
                                className="text-blue-100" // ✅ Fondo azul muy claro
                            />
                            {/* Progress Circle */}
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="none"
                                strokeLinecap="round"
                                className={`transition-colors duration-500 ${getSpinnerColor()}`}
                                style={{
                                    strokeDasharray: `${2 * Math.PI * 45}`,
                                    strokeDashoffset: `${2 * Math.PI * 45 * (1 - progress / 100)}`,
                                    transition: 'stroke-dashoffset 1s linear'
                                }}
                            />
                        </svg>

                        {/* Clock Icon in Center */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" strokeWidth="2" />
                                <polyline points="12,6 12,12 16,14" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {title}
                    </h3>

                    {/* Message */}
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                        {message}
                    </p>

                    {/* Time Left */}
                    <div className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-100">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" strokeWidth="2" />
                            <polyline points="12,6 12,12 16,14" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        <span className="text-sm font-medium text-blue-700">
                            {formatTime(timeLeft)}
                        </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                        <div className="w-full bg-blue-100 rounded-full h-2 overflow-hidden"> {/* ✅ Fondo azul claro */}
                            <div
                                className={`h-2 rounded-full transition-all duration-1000 ease-linear ${getProgressBarColor()}`}
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <div className="flex justify-between text-xs text-blue-600 mt-1"> {/* ✅ Texto azul */}
                            <span>0%</span>
                            <span className="font-medium">{Math.round(progress)}%</span>
                            <span>100%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalTimer;