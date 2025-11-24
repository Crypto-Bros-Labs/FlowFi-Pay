import React, { useState } from "react";
import { Check, X } from "lucide-react";
import ButtonApp from "../../../../shared/components/ButtonApp";
import ModalWrapper from "../../../../shared/components/ModalWrapper";
import TileApp from "../../../../shared/components/TileApp";
import type { DynamicToken } from "../hooks/useSelectTokenDynamic";
import { formatCryptoAddressCustom } from "../../../../shared/utils/cryptoUtils";
import { BiCheck, BiCopy } from "react-icons/bi";

interface TransferResultModalProps {
    isOpen: boolean;
    isSuccess: boolean;
    token: DynamicToken;
    amountToken: string;
    urlTransfer?: string;
    hashTransfer?: string;
    onClose: () => void;
}

const TransferResultModal: React.FC<TransferResultModalProps> = ({
    isOpen,
    isSuccess,
    token,
    amountToken,
    urlTransfer,
    hashTransfer,
    onClose,
}) => {
    const [isCopied, setIsCopied] = useState(false);
    const handleCopyHash = () => {
        if (hashTransfer) {
            navigator.clipboard.writeText(hashTransfer).then(() => {
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
            });
        }
    }
    if (!isOpen) return null;



    return (
        <ModalWrapper onClose={onClose}>
            <div className="bg-white rounded-[1.25rem] w-full max-w-md p-6 flex flex-col border-2 border-[#3E5EF5] shadow-lg">
                {/* Close Button */}
                <div className="flex justify-end mb-4">
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="w-full flex flex-col items-center justify-center py-6">
                    {/* Status Icon */}
                    <div className="mb-6">
                        {isSuccess ? (
                            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                <Check className="w-8 h-8 text-green-600" />
                            </div>
                        ) : (
                            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                                <X className="w-8 h-8 text-red-600" />
                            </div>
                        )}
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl font-bold text-[#020F1E] mb-2 text-center">
                        {isSuccess ? 'Envío Exitoso' : 'Envío Fallido'}
                    </h1>

                    {/* Subtitle */}
                    {!isSuccess && (
                        <p className="text-gray-500 text-sm text-center mb-6">
                            Algo salió mal
                        </p>
                    )}

                    {/* Transaction Details */}
                    {isSuccess && (
                        <div className="w-full space-y-3 mb-6 px-2">
                            <TileApp
                                title="Monto"
                                titleClassName="text-sm text-[#666666]"
                                trailing={
                                    <span className="text-sm font-semibold text-[#020F1E] break-all">
                                        {amountToken} {token.symbol}
                                    </span>
                                }
                                className="bg-gray-50"
                            />

                            <TileApp
                                title="Red"
                                titleClassName="text-sm text-[#666666]"
                                trailing={
                                    <span className="text-sm font-semibold text-[#020F1E] break-all">
                                        {token.network}
                                    </span>
                                }
                                className="bg-gray-50"
                            />

                            {urlTransfer && (
                                <TileApp
                                    title="URL"
                                    titleClassName="text-sm text-[#666666]"
                                    trailing={
                                        <a
                                            href={urlTransfer}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm font-semibold text-blue-600 hover:text-blue-700 break-all line-clamp-2"
                                        >
                                            Ver
                                        </a>
                                    }
                                    className="bg-gray-50"
                                />
                            )}

                            {hashTransfer && (
                                <TileApp
                                    title="Hash"
                                    titleClassName="text-sm text-[#666666] mb-2"
                                    subtitle={
                                        <code className="text-xs font-mono text-[#020F1E] bg-gray-100 px-2 py-1 rounded break-all">
                                            {formatCryptoAddressCustom(hashTransfer, 16, 4)}
                                        </code>
                                    }
                                    trailing={
                                        <button
                                            onClick={handleCopyHash}
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

                            )}
                        </div>
                    )}
                </div>

                {/* Footer Button */}
                <div className="px-2">
                    <ButtonApp
                        text="Aceptar"
                        textSize="text-sm"
                        paddingVertical="py-3"
                        isMobile={true}
                        onClick={onClose}
                    />
                </div>
            </div>
        </ModalWrapper>
    );
};

export default TransferResultModal;