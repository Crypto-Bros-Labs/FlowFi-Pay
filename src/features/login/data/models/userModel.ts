export interface UpdateUserData {
    userUuid: string;
    phone: string;
    fullName: string;
}

export interface UserDataResponse {
    userUuid: string;
    phone: string;
    fullName: string;
    email: string;
}

export interface UserData {
    data: UserDataResponse;
    message: string;
    success: boolean;
    status: string;
    code: number;
}