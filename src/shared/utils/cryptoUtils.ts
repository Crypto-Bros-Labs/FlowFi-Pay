
export const formatCryptoAddress = (
    address: string,
    format: 'short' | 'medium' = 'short'
): string => {
    if (!address) return '';

    // Remover espacios en blanco
    const cleanAddress = address.trim();

    // Si la dirección es muy corta, devolverla tal como está
    if (cleanAddress.length <= 10) {
        return cleanAddress;
    }

    const startChars = format === 'short' ? 6 : 9;
    const endChars = 3;

    // Verificar que la dirección sea lo suficientemente larga
    if (cleanAddress.length <= startChars + endChars) {
        return cleanAddress;
    }

    const start = cleanAddress.substring(0, startChars);
    const end = cleanAddress.substring(cleanAddress.length - endChars);

    return `${start}...${end}`;
};

export const formatCryptoAddressCustom = (
    address: string,
    startChars: number,
    endChars: number
): string => {
    if (!address) return '';

    const cleanAddress = address.trim();

    if (cleanAddress.length <= startChars + endChars) {
        return cleanAddress;
    }

    const start = cleanAddress.substring(0, startChars);
    const end = cleanAddress.substring(cleanAddress.length - endChars);

    return `${start}...${end}`;
};


export const isValidCryptoAddress = (address: string): boolean => {
    if (!address) return false;

    const cleanAddress = address.trim();

    // Verificaciones básicas
    if (cleanAddress.length < 20 || cleanAddress.length > 100) {
        return false;
    }

    // Ethereum address (0x + 40 hex chars)
    const ethPattern = /^0x[a-fA-F0-9]{40}$/;

    // Bitcoin address patterns
    const btcLegacyPattern = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
    const btcSegwitPattern = /^bc1[a-z0-9]{39,59}$/;

    return ethPattern.test(cleanAddress) ||
        btcLegacyPattern.test(cleanAddress) ||
        btcSegwitPattern.test(cleanAddress);
};