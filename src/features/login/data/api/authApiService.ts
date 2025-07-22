import { publicAxiosInstance } from '../../../../shared/api/axiosService';
import type { LoginResponse, AuthResponse } from '../models/authModel';

class AuthService {
    async login(email: string, code: string): Promise<LoginResponse> {
        const response = await publicAxiosInstance.post('/user/login', { email, code });
        return response.data.data;
    }

    async getAuthData(userEmail: string): Promise<AuthResponse> {
        const response = await publicAxiosInstance.get(`/auth/${userEmail}`);
        return response.data;
    }
}

export default new AuthService();