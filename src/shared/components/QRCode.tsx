import React from 'react';

interface QRCodeProps {
    data: string;
    size?: number;
    className?: string;
}

const QRCode: React.FC<QRCodeProps> = ({ data, size = 150, className = "" }) => {
    // Usando QR Server API (alternativa a qrcode library)
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}`;

    return (
        <div className={`flex justify-center ${className}`}>
            <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                <img
                    src={qrUrl}
                    alt="QR Code"
                    width={size}
                    height={size}
                    className="block"
                    onError={(e) => {
                        // Fallback en caso de error
                        (e.target as HTMLImageElement).src = `data:image/svg+xml;base64,${btoa(`
                            <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
                                <rect width="100%" height="100%" fill="#f3f4f6"/>
                                <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="12" fill="#6b7280">
                                    QR Code
                                </text>
                            </svg>
                        `)}`;
                    }}
                />
            </div>
        </div>
    );
};

export default QRCode;