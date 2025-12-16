import { axiosInstance, axiosFormDataInstance } from '../../../../shared/api/axiosService';
import type { UserData, UpdateUserData, UserPictureResponse, KycStatusResponse, TeamMemberRequest } from '../models/userModel';

class UserService {
    async updateUser(userData: UpdateUserData): Promise<UserData> {
        const response = await axiosInstance.put('/user', userData);
        return response.data;
    }

    async getUser(userUuid: string): Promise<UserData> {
        const response = await axiosInstance.get(`/user/info/${userUuid}`);
        return response.data;
    }

    async uploadUserPicture(formData: FormData, userUuid: string): Promise<UserPictureResponse> {
        const response = await axiosFormDataInstance.put(`/user/update-picture/${userUuid}`, formData);
        return response.data;
    }

    async getKycStatus(userUuid: string): Promise<KycStatusResponse> {
        const response = await axiosInstance.get(`/user/kyc/info/${userUuid}`);
        return response.data.data;
    }

    async deleteUserPicture(userUuid: string): Promise<void> {
        await axiosInstance.delete(`/user/remove-picture/${userUuid}`);
    }

    async createTeamMember(memberData: TeamMemberRequest): Promise<void> {
        await axiosInstance.post('/user/team-member/', memberData);
    }
}

export default new UserService();