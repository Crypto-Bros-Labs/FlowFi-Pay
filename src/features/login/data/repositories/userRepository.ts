import userApiService from "../api/userApiService";
import userLocalService from "../local/userLocalService";
import type {
  KycStatusResponse,
  TeamMemberRequest,
  UserData,
  TeamMemberResponse,
} from "../models/userModel";

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
        fullName: response.data.fullName,
      });

      userLocalService.setHasAllData(true);

      return true;
    } catch (error) {
      console.error("Update user failed:", error);
      return false;
    }
  }

  async fetchUserData(userUuid: string): Promise<UserData> {
    try {
      const response = await userApiService.getUser(userUuid);
      return response;
    } catch (error) {
      console.error("Fetch user data failed:", error);
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

  async uploadUserPicture(
    formData: FormData,
    userUuid: string
  ): Promise<boolean> {
    try {
      const response = await userApiService.uploadUserPicture(
        formData,
        userUuid
      );
      console.log("Upload user picture response:", response);

      return response.success;
    } catch (error) {
      console.error("Upload user picture failed:", error);
      return false;
    }
  }

  async deleteUserPicture(userUuid: string): Promise<boolean> {
    try {
      await userApiService.deleteUserPicture(userUuid);
      return true;
    } catch (error) {
      console.error("Delete user picture failed:", error);
      return false;
    }
  }

  async getKycStatus(userUuid: string): Promise<KycStatusResponse> {
    try {
      const response = await userApiService.getKycStatus(userUuid);
      return response;
    } catch (error) {
      console.error("Get KYC status failed:", error);
      throw error;
    }
  }

  async createTeamMember(memberData: TeamMemberRequest): Promise<boolean> {
    try {
      await userApiService.createTeamMember(memberData);
      return true;
    } catch (error) {
      console.error("Create team member failed:", error);
      return false;
    }
  }

  async getTeamMembers(userUuid: string): Promise<TeamMemberResponse[]> {
    try {
      const response = await userApiService.getTeamMembers(userUuid);
      return response;
    } catch (error) {
      console.error("Get team members failed:", error);
      throw error;
    }
  }
}

export default new UserRepository();
