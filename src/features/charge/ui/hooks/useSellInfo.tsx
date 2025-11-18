import { useEffect, useState } from 'react';
import { formatCryptoAddress } from '../../../../shared/utils/cryptoUtils';
import type { Amounts, SellData } from '../../data/local/sellLocalService';
import type { Token } from '../../data/local/tokenLocalService';
import sellRepository from '../../data/repositories/sellRepository';
import historyRepository from '../../../history/data/repositories/historyRepository';
import tokenRepository from '../../data/repositories/tokenRepository';

export const useSellInfo = () => {
    const [walletData, setWalletData] = useState<SellData | null>(null);
    const [amounts, setAmounts] = useState<Amounts | null>(null);
    const [selectedToken, setSelectedToken] = useState<Token | null>(null);
    const [isCancelLoading, setIsCancelLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchWalletData = async () => {
            try {
                const offRampData = sellRepository.getSellData();
                const amountsData = sellRepository.getAmounts();
                const token = tokenRepository.getSelectedToken();

                setWalletData(offRampData);
                setAmounts(amountsData);
                setSelectedToken(token);
            } catch (error) {
                console.error('Error fetching wallet data:', error);
            }
        };

        fetchWalletData();
    }, [walletData, amounts, selectedToken]);

    // Función para generar QR code data
    const generateQRData = () => {
        // Para Ethereum, el formato estándar es ethereum:address
        return `${walletData?.destinationWalletAddress}`;

    };

    const cancelTransaction = async (transactionId: string): Promise<boolean> => {
        setIsCancelLoading(true);
        try {
            const result = await historyRepository.cancelTransaction(transactionId);
            if (result.success) {
                console.log('Transacción cancelada con éxito');
                return true;
            } else {
                console.error('Failed to cancel transaction:', result.error);
                return false;
            }
        } catch (err) {
            console.error('Error cancelling transaction:', err);
            return false;
        } finally {
            setIsCancelLoading(false);
        }
    };


    return {
        walletData,
        amounts,
        selectedToken,
        formattedAddress: formatCryptoAddress(walletData?.destinationWalletAddress ?? '', 'medium'),
        qrData: generateQRData(),
        isCancelLoading,
        cancelTransaction,
    };
};