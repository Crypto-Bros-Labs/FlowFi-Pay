import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BiCopy, BiCheck } from "react-icons/bi";
import AppHeader from "../../../../shared/components/AppHeader";
import TileApp from "../../../../shared/components/TileApp";
import QRCode from "../../../../shared/components/QRCode";
import blueUser from '/illustrations/blueuser.png';
import { useProfile } from "../../../profile/ui/hooks/useProfile";
import { formatCryptoAddressCustom } from "../../../../shared/utils/cryptoUtils";

const ReceivePage: React.FC = () => {
    const navigate = useNavigate();
    const [isCopied, setIsCopied] = useState(false);

    const {
        walletAddress,
        profileImage,
        isLoadingUserData,
        fullName,

    } = useProfile();

    const handleCopyAddress = () => {
        navigator.clipboard.writeText(walletAddress);
        setIsCopied(true);

        // ✅ Resetear el estado después de 2 segundos
        setTimeout(() => {
            setIsCopied(false);
        }, 2000);
    };

    if (isLoadingUserData) {
        return (
            <div className="flex h-full flex-col items-center justify-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-2 text-gray-500">Cargando datos...</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full p-4 overflow-y-auto">
            <AppHeader
                title="Recibir"
                onBack={() => navigate(-1)}
            />

            {/* ✅ SECCIÓN SUPERIOR - Perfil sin edición */}
            <div className="flex flex-col items-center mt-6 mb-8">
                {/* Imagen de perfil */}
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden mb-4">
                    {profileImage ? (
                        <img
                            src={profileImage}
                            alt="Profile"
                            className="w-full h-full object-cover object-center"
                        />
                    ) : (
                        <img
                            src={blueUser}
                            alt="User Icon"
                            className="w-full h-full object-cover"
                        />
                    )}
                </div>

                {/* Nombre */}
                <h2 className="text-lg font-semibold text-gray-900 text-center">
                    {isLoadingUserData ? 'Cargando...' : fullName}
                </h2>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-300 mx-2 mb-6"></div>

            {/* ✅ SECCIÓN DE DIRECCIÓN - Tile con Copy */}
            <div className="flex flex-col items-center mb-6 px-2">
                <div className="w-full">
                    <TileApp
                        title="Tu dirección"
                        subtitle={formatCryptoAddressCustom(walletAddress, 20, 4)}
                        titleSize="base"
                        subtitleSize="xs"
                        trailing={
                            <button
                                onClick={handleCopyAddress}
                                className="
                                    flex items-center justify-center
                                    w-10 h-10
                                    rounded-full
                                    bg-blue-100
                                    hover:bg-blue-200
                                    transition-colors duration-200
                                    cursor-pointer
                                    flex-shrink-0
                                "
                                title="Copiar dirección"
                            >
                                {isCopied ? (
                                    <BiCheck className="w-5 h-5 text-green-600" />
                                ) : (
                                    <BiCopy className="w-5 h-5 text-blue-600" />
                                )}
                            </button>
                        }
                    />
                </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-300 mx-2 mb-6"></div>

            {/* ✅ SECCIÓN QR - Centrada */}
            <div className="flex flex-col items-center mb-6">
                <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                    <QRCode
                        data={walletAddress}
                        size={200}
                        foregroundColor="2563eb"
                        backgroundColor="ffffff"
                    />
                </div>
            </div>

            {/* ✅ LEYENDA - Texto centrado */}
            <div className="flex flex-col items-center px-4">
                <p className="text-sm font-medium text-gray-600 text-center leading-relaxed">
                    Esta es tu dirección para recibir dinero de la red de Starknet
                </p>
            </div>
        </div>
    );
};

export default ReceivePage;