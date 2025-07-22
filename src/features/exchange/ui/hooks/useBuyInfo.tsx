import rampRepository from "../../data/repositories/rampRepository";

export const useBuyInfo = () => {

    // Datos mock del beneficiario y banco
    const beneficiaryData = rampRepository.getOnRampData() || {
        name: 'N/A',
        entity: 'N/A',
        clabe: 'N/A',
    };

    // Función para copiar CLABE al portapapeles
    const copyToClipboard = async () => {
        try {
            const clabeNumbers = beneficiaryData.clabe.replace(/\s/g, '');
            await navigator.clipboard.writeText(clabeNumbers);

            alert('CLABE copiada al portapapeles');
            console.log('CLABE copiada:', clabeNumbers);
        } catch (err) {
            console.error('Error al copiar al portapapeles:', err);
            alert('No se pudo copiar automáticamente. CLABE: ' + beneficiaryData.clabe.replace(/\s/g, ''));
        }
    };

    // Función para compartir datos
    const shareData = async () => {
        const shareText = `Datos para transferencia:
        Beneficiario: ${beneficiaryData.name}
        Entidad: ${beneficiaryData.entity}
        CLABE: ${beneficiaryData.clabe.replace(/\s/g, '')}`;

        try {
            if (navigator.share) {
                await navigator.share({
                    title: 'Datos de transferencia',
                    text: shareText,
                });
                console.log('Datos compartidos exitosamente');
            } else {
                await navigator.clipboard.writeText(shareText);
                alert('Datos copiados al portapapeles');
                console.log('Datos copiados:', shareText);
            }
        } catch (err) {
            console.error('Error al compartir:', err);
            alert('No se pudieron compartir los datos');
        }
    };

    return {
        beneficiaryData,
        copyToClipboard,
        shareData,
    };
};