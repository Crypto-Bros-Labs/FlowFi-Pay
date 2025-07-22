import userApiService from "../api/userApiService";
import userLocalService from "../local/userLocalService";

class UserRepository {
    async updateUser(userData: {
        userUuid: string;
        phone: string;
        fullName: string;
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

    async getCurrentUserData() {
        return userLocalService.getUserData();
    }
}

export default new UserRepository();