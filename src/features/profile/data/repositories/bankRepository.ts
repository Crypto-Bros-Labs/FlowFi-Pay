import bankApiService from "../api/bankApiService";
import type { BankAccountResponse, BankAccounts, BankData } from "../models/bankModel";

class BankRepository {
    async getBankAccounts(userUuid: string): Promise<{ success: boolean, data?: BankAccounts[], error?: string }> {
        try {
            const bankAccounts = await bankApiService.getBankAccounts(userUuid);
            return { success: true, data: bankAccounts };
        } catch (error) {
            console.error('Error fetching bank accounts:', error);
            return { success: false, error: 'Error fetching bank accounts' };
        }

    }

    async addBankAccount(data: BankData): Promise<{ success: boolean, data?: BankAccountResponse, error?: string }> {
        try {
            const response = await bankApiService.addBankAccount(data);
            return { success: true, data: response };
        } catch (error) {
            console.error('Error adding bank account:', error);
            return { success: false, error: 'Error adding bank account' };
        }
    }
}


export default new BankRepository();
