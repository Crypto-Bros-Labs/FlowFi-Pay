export interface LoginResponse {
    token: string;
    refreshToken: string;
}

export interface AuthData {
    userUuid: string;
    hasAllData: boolean;
}

export interface AuthResponse {
    data: AuthData;
    message: string;
    success: boolean;
    status: string;
    code: number;
}