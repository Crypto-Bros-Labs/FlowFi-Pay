import { axiosWithAuthInstance } from "../../../../shared/api/axiosService";
import type { BankAccountResponse, BankAccounts, BankData } from "../models/bankModel";

class BankApiService {
    async getBankAccounts(userUuid: string): Promise<BankAccounts[]> {
        try {
            const response = await axiosWithAuthInstance.get('/bank-information/user/' + userUuid);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching bank accounts:', error);
            throw error;
        }
    }

    async addBankAccount(data: BankData): Promise<BankAccountResponse> {
        try {
            const response = await axiosWithAuthInstance.post('/bank-information', data);
            return response.data.data;
        } catch (error) {
            console.error('Error adding bank account:', error);
            throw error;
        }
    }
}

export default new BankApiService();