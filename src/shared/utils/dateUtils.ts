export const formatDateToSpanishMX = (dateString: string): string => {
    try {
        const date = new Date(dateString);

        // Verificar que la fecha es válida
        if (isNaN(date.getTime())) {
            return dateString; // Retornar original si no es válida
        }

        return date.toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    } catch (error) {
        console.error('Error formateando fecha:', error);
        return dateString;
    }
};

// ✅ Función más corta para solo fecha CON HORA
export const formatDateShort = (dateString: string): string => {
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;

        const dateFormatted = date.toLocaleDateString('es-MX', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });

        const timeFormatted = date.toLocaleTimeString('es-MX', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });

        return `${dateFormatted} • ${timeFormatted}`;
    } catch (e) {
        console.error('Error formateando fecha corta:', e);
        return dateString;
    }
};

// ✅ Función para mostrar fecha relativa CON HORA
export const formatDateRelative = (dateString: string): string => {
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;

        const now = new Date();
        const diffInMs = now.getTime() - date.getTime();
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

        const timeFormatted = date.toLocaleTimeString('es-MX', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });

        if (diffInMinutes < 1) {
            return 'Ahora mismo';
        } else if (diffInMinutes < 60) {
            return `Hace ${diffInMinutes} min • ${timeFormatted}`;
        } else if (diffInHours < 24) {
            return `Hace ${diffInHours}h • ${timeFormatted}`;
        } else if (diffInDays === 0) {
            return `Hoy • ${timeFormatted}`;
        } else if (diffInDays === 1) {
            return `Ayer • ${timeFormatted}`;
        } else if (diffInDays < 7) {
            return `Hace ${diffInDays} días • ${timeFormatted}`;
        } else {
            const dateFormatted = date.toLocaleDateString('es-MX', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
            return `${dateFormatted} • ${timeFormatted}`;
        }
    } catch (error) {
        console.error('Error formateando fecha relativa:', error);
        return dateString;
    }
};

// ✅ Nueva función: Solo hora (útil para mostrar en cards pequeñas)
export const formatTimeOnly = (dateString: string): string => {
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;

        return date.toLocaleTimeString('es-MX', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    } catch (error) {
        console.error('Error formateando hora:', error);
        return dateString;
    }
};

// ✅ Nueva función: Fecha y hora más compacta
export const formatDateTimeCompact = (dateString: string): string => {
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;

        const now = new Date();
        const isToday = now.toDateString() === date.toDateString();
        const isYesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toDateString() === date.toDateString();

        const timeFormatted = date.toLocaleTimeString('es-MX', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });

        if (isToday) {
            return `Hoy ${timeFormatted}`;
        } else if (isYesterday) {
            return `Ayer ${timeFormatted}`;
        } else {
            const dateFormatted = date.toLocaleDateString('es-MX', {
                day: 'numeric',
                month: 'short'
            });
            return `${dateFormatted} ${timeFormatted}`;
        }
    } catch (error) {
        console.error('Error formateando fecha compacta:', error);
        return dateString;
    }
};