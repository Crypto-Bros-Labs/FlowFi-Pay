import userApiService from "../api/userApiService";
import userLocalService from "../local/userLocalService";
import type { UserData } from "../models/userModel";

class UserRepository {
    async updateUser(userData: {
        userUuid: string;
        phone: string;
        fullName: string;
        image: string;
    }): Promise<boolean> {
        try {
            // 1. Llamada al servicio API
            const response = await userApiService.updateUser(userData);

            // 2. Actualizar estado local
            userLocalService.setProfileData({
                phone: response.data.phone,
                fullName: response.data.fullName
            });

            userLocalService.setHasAllData(true);

            return true;
        } catch (error) {
            console.error('Update user failed:', error);
            return false;
        }
    }

    async fetchUserData(userUuid: string): Promise<UserData> {
        try {
            const response = await userApiService.getUser(userUuid);
            return response;
        }
        catch (error) {
            console.error('Fetch user data failed:', error);
            throw error;
        }
    }

    async getCurrentUserData() {
        return userLocalService.getUserData();
    }

    async setBankAccountUuid(bankAccountUuid: string): Promise<void> {
        userLocalService.setBankAccountUuid(bankAccountUuid);
    }

    async getBankAccountUuid(): Promise<string | null> {
        return userLocalService.getBankAccountUuid();
    }
}

export default new UserRepository();