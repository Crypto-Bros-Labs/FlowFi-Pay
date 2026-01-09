import type { TransactionStatus } from "../../features/history/ui/components/TileHistory";

export const parseTransactionStatus = (status: string): TransactionStatus => {
    const statusMap: Record<string, TransactionStatus> = {
        // Estados completados
        'completed': 'completed',
        'success': 'completed',
        'successful': 'completed',
        'done': 'completed',
        'finished': 'completed',
        'approved': 'completed',

        // Estados pendientes
        'pending': 'pending',
        'processing': 'pending',
        'in_progress': 'pending',
        'waiting': 'pending',
        'reviewing': 'pending',

        // Estados cancelados
        'canceled': 'canceled',
        'cancelled': 'canceled',
        'failed': 'canceled',
        'rejected': 'canceled',
        'error': 'canceled',
        'declined': 'canceled',
        'crypto_not_received': 'canceled',

        // Estado de orden
        'order': 'order',
    };

    return statusMap[status.toLowerCase()] || 'pending'; // Default a pending


};

export const parseTransactionType = (type: string): 'ON_RAMP' | 'OFF_RAMP' => {
    const typeMap: Record<string, 'ON_RAMP' | 'OFF_RAMP'> = {
        'on_ramp': 'ON_RAMP',
        'off_ramp': 'OFF_RAMP',
        'buy': 'ON_RAMP',
        'sell': 'OFF_RAMP',
        'purchase': 'ON_RAMP',
        'withdrawal': 'OFF_RAMP',
        'ON_RAMP': 'ON_RAMP',
        'OFF_RAMP': 'OFF_RAMP',
        'BUY': 'ON_RAMP',
        'SELL': 'OFF_RAMP',
        'PURCHASE': 'ON_RAMP',
        'WITHDRAWAL': 'OFF_RAMP',
    };  
    return typeMap[type.toUpperCase()] || 'OFF_RAMP'; // Default a OFF_RAMP
};