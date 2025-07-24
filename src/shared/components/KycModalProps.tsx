import React, { useEffect, useRef, useState } from 'react';

interface KycModalProps {
    isOpen: boolean;
    kycUrl: string;
    onComplete: () => void;
    onCancel: () => void;
}

export const KycModal: React.FC<KycModalProps> = ({
    isOpen,
    kycUrl,
    onComplete,
    onCancel
}) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!isOpen) return;

        const handleMessage = (event: MessageEvent) => {
            if (event.origin !== new URL(kycUrl).origin) return;

            if (event.data.type === 'KYC_COMPLETE') {
                onComplete();
            } else if (event.data.type === 'KYC_CANCELLED') {
                onCancel();
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [isOpen, kycUrl, onComplete, onCancel]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={onCancel}
            />

            {/* Modal */}
            <div className="relative w-full h-full max-w-4xl max-h-[90vh] bg-white rounded-lg shadow-xl m-4">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Verificación de Identidad
                    </h2>
                    <button
                        onClick={onCancel}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Loading indicator */}
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-10">
                        <div className="text-center">
                            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                            <p className="text-sm text-gray-600">Cargando verificación...</p>
                        </div>
                    </div>
                )}

                {/* Iframe */}
                <iframe
                    ref={iframeRef}
                    src={kycUrl}
                    className="w-full h-full rounded-b-lg"
                    style={{ height: 'calc(100% - 64px)' }}
                    onLoad={() => setIsLoading(false)}
                    sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                />
            </div>
        </div>
    );
};