import authApiService from "../api/authApiService";
import authLocalService from "../local/authLocalService";
import userLocalService from "../local/userLocalService";

class AuthRepository {

    async getAuthData(email: string): Promise<boolean> {
        try {

            const authData = await authApiService.getAuthData(email);

            console.log('AuthData response:', authData);

            userLocalService.setAuthData({
                userUuid: authData.data.userUuid,
                hasAllData: authData.data.hasAllData,
                email
            });

            return true;
        } catch (error) {
            this.handleError(error);
            return false;
        }
    }

    async login(email: string, code: string): Promise<boolean> {
        try {
            // 1. Llamada al servicio API
            const response = await authApiService.login(email, code);

            const token = response.token;
            const refreshToken = response.refreshToken;

            // 2. Guardar tokens usando AuthLocalService
            authLocalService.setTokens(token, refreshToken);

            return true;
        } catch (error) {
            this.handleError(error);
            return false;
        }
    }

    logout(): void {
        authLocalService.clearTokens();
        userLocalService.clearUser();
    }

    private handleError(error: unknown): void {
        console.error('Auth error:', error);
    }
}

export default new AuthRepository();