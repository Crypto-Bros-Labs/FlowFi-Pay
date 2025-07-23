export const formatCurrency = (value: number, maxDecimals: number = 6): string => {
    if (isNaN(value) || value === 0) {
        return "0.00";
    }

    // Redondear al número máximo de decimales
    const rounded = parseFloat(value.toFixed(maxDecimals));

    // Convertir a string y eliminar ceros del final
    let result = rounded.toString();

    // Si no tiene punto decimal, agregar .00
    if (!result.includes('.')) {
        result += '.00';
    } else {
        // Si tiene decimales pero todos son ceros después del punto, mantener al menos 2
        const parts = result.split('.');
        if (parts[1] && parseInt(parts[1]) === 0) {
            result = parts[0] + '.00';
        }
    }

    return result;
};

export const truncateLeft = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return '...' + text.slice(-(maxLength - 3));
};