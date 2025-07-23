import { formatCryptoAddress } from '../../../../shared/utils/cryptoUtils';

export const useSellInfo = () => {

    // Datos mock de la wallet de venta
    const walletData = {
        address: "0x9Fc5b510185E7a218A2e5BDc8F7A14a2B8b90F123",
        network: "Arbitrum",
        supportedTokens: ["BTC", "ETH", "MXNB"]
    };

    // Función para copiar dirección al portapapeles
    const copyAddressToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(walletData.address);
            alert('Dirección copiada al portapapeles');
            console.log('Dirección copiada:', walletData.address);
        } catch (err) {
            console.error('Error al copiar al portapapeles:', err);
            alert('No se pudo copiar automáticamente. Dirección: ' + walletData.address);
        }
    };

    // Función para generar QR code data
    const generateQRData = () => {
        // Para Ethereum, el formato estándar es ethereum:address
        return `arbitrum:${walletData.address}`;
    };



    return {
        walletData,
        formattedAddress: formatCryptoAddress(walletData.address, 'medium'),
        qrData: generateQRData(),
        copyAddressToClipboard,
    };
};