import { axiosInstance } from '../../../../shared/api/axiosService';
import type { UserData, UpdateUserData } from '../models/userModel';

class UserService {
    async updateUser(userData: UpdateUserData): Promise<UserData> {
        const response = await axiosInstance.put('/user', userData);
        return response.data;
    }

    async getUser(userUuid: string): Promise<UserData> {
        const response = await axiosInstance.get(`/user/info/${userUuid}`);
        return response.data;
    }
}

export default new UserService();