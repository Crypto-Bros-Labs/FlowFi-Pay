import { axiosWithAuthInstance } from "../../../../shared/api/axiosService";
import type { TokenData, ProviderData } from "../models/tokenModel";

class TokenService {
  async getTokens(): Promise<TokenData[]> {
    const response = await axiosWithAuthInstance.get("/token");
    return response.data.data.content;
  }

  async getProviders(tokenUuid: string): Promise<ProviderData[]> {
    const response = await axiosWithAuthInstance.get(
      "/token/" + tokenUuid + "/providers",
    );
    return response.data.data;
  }
}

export default new TokenService();
