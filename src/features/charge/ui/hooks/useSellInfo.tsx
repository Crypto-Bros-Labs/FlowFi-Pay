import { useEffect, useState } from 'react';
import { formatCryptoAddress } from '../../../../shared/utils/cryptoUtils';
import type { Amounts, SellData } from '../../data/local/sellLocalService';
import type { Token } from '../../data/local/tokenLocalService';
import sellRepository from '../../data/repositories/sellRepository';
import tokenRepository from '../../../exchange/data/repositories/tokenRepository';

export const useSellInfo = () => {
    const [walletData, setWalletData] = useState<SellData | null>(null);
    const [amounts, setAmounts] = useState<Amounts | null>(null);
    const [selectedToken, setSelectedToken] = useState<Token | null>(null);

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
        return `ethereum:${walletData?.destinationWalletAddress}`;
    };


    return {
        walletData,
        amounts,
        selectedToken,
        formattedAddress: formatCryptoAddress(walletData?.destinationWalletAddress ?? '', 'medium'),
        qrData: generateQRData(),
    };
};