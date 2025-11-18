import React from "react";
import { Check, X } from "lucide-react";
import ButtonApp from "../../../../shared/components/ButtonApp";
import ModalWrapper from "../../../../shared/components/ModalWrapper";
import TileApp from "../../../../shared/components/TileApp";
import type { DynamicToken } from "../hooks/useSelectTokenDynamic";

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
                <div className="flex flex-col items-center justify-center py-6">
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
                                    titleClassName="text-sm text-[#666666]"
                                    trailing={
                                        <code className="text-xs font-mono text-[#020F1E] bg-gray-100 px-2 py-1 rounded break-all">
                                            {hashTransfer.substring(0, 16)}...
                                        </code>
                                    }
                                    className="bg-gray-50"
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