import React from 'react';
import { IoPerson } from 'react-icons/io5';
import { BiQrScan } from 'react-icons/bi';
import TileApp from '../../../../shared/components/TileApp';

interface TransferSectionProps {
    address: string;
    onChange: (address: string) => void;
    onScanQR?: () => void;
}

const TransferSection: React.FC<TransferSectionProps> = ({
    address,
    onChange,
    onScanQR
}) => {
    return (
        <div className="mb-1 px-2">
            <TileApp
                title="Dirección destino"
                leading={
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <IoPerson className="w-5 h-5 text-blue-600" />
                    </div>
                }
                trailing={
                    <button
                        onClick={onScanQR}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        title="Escanear QR"
                    >
                        <BiQrScan className="w-5 h-5 text-blue-600" />
                    </button>
                }
            />
            {/* Input para dirección */}
            <input
                type="text"
                value={address}
                onChange={(e) => onChange(e.target.value)}
                placeholder="0x1234567890abcdef1234567890abcdef"
                className="
                    w-full mt-3 px-4 py-3
                    border border-[#666666] rounded-[10px]
                    bg-white
                    text-sm font-medium text-gray-900
                    placeholder-gray-400
                    outline-none
                    transition-all duration-200
                    focus:border-blue-500 focus:ring-2 focus:ring-blue-100
                    hover:border-gray-400
                "
            />
        </div>
    );
};

export default TransferSection;