import { axiosWithAuthInstance } from "../../../../shared/api/axiosService";
import type { SavedWallet, WalletData } from "../models/savedWalletsModel";


class SavedWalletsApiService {
    async getSavedWallets(userUuid: string): Promise<SavedWallet[]> {
        try {
            const response = await axiosWithAuthInstance.get('/contact-wallets/saved/' + userUuid);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching bank accounts:', error);
            throw error;
        }
    }

    async addWallet(data: WalletData): Promise<SavedWallet> {
        try {
            const response = await axiosWithAuthInstance.post('/contact-wallets/add', data);
            return response.data.data;
        } catch (error) {
            console.error('Error adding bank account:', error);
            throw error;
        }
    }
}

export default new SavedWalletsApiService();