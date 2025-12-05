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