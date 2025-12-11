import savedWalletsApiService from "../api/savedWalletsApiService";
import type { SavedWallet, WalletData } from "../models/savedWalletsModel";

class SavedWalletsRepository {

    async getSavedWallets(userId: string): Promise<SavedWallet[]> {
        try {
            const savedWallets = await savedWalletsApiService.getSavedWallets(userId);
            return savedWallets;
        } catch (error) {
            console.error('Error fetching saved wallets:', error);
            return [];
        }
    }

    async addWallet(data: WalletData): Promise<boolean> {
        try {
            const response = await savedWalletsApiService.addWallet(data);
            if (!response) {
                return false;
            }
            return true;
        } catch (error) {
            console.error('Error adding wallet:', error);
            return false;
        }
    }
}

export default new SavedWalletsRepository(); 